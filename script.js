(() => {
  'use strict';

  const STORAGE_KEY = 'work-clock-records-v1';
  const CLOUD_SETTINGS_KEY = 'work-clock-cloud-settings-v1';
  const MAX_HISTORY_ITEMS = 60;
  const MAX_DELETED_ITEMS = 60;
  const CLOUD_CRYPTO_SALT = 'work-clock-cloud-sync-v1';
  const FIREBASE_SDK_URLS = [
    'https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore-compat.js'
  ];

  const $ = (selector) => document.querySelector(selector);

  const elements = {
    connectionStatus: $('#connectionStatus'),
    currentTime: $('#currentTime'),
    todayTitle: $('#todayTitle'),
    todayStatus: $('#todayStatus'),
    todayIn: $('#todayIn'),
    todayOut: $('#todayOut'),
    todayDuration: $('#todayDuration'),
    clockInButton: $('#clockInButton'),
    clockOutButton: $('#clockOutButton'),
    historyList: $('#historyList'),
    exportButton: $('#exportButton'),
    installHint: $('#installHint'),
    toast: $('#toast'),
    updateBanner: $('#updateBanner'),
    reloadButton: $('#reloadButton'),
    cloudSyncButton: $('#cloudSyncButton'),
    cloudConnectButton: $('#cloudConnectButton'),
    cloudDisconnectButton: $('#cloudDisconnectButton'),
    cloudCodeInput: $('#cloudCodeInput'),
    cloudStatus: $('#cloudStatus'),
    cloudDot: $('#cloudDot'),
    cloudSyncPanel: $('#cloudSyncPanel')
  };

  const cloudConfig = window.WORK_CLOCK_CLOUD_CONFIG || {};
  const savedCloudSettings = loadCloudSettings();
  const cloudState = {
    configured: isCloudConfigured(),
    syncCode: savedCloudSettings.syncCode,
    lastSyncedAt: savedCloudSettings.lastSyncedAt,
    docId: null,
    cryptoKey: null,
    db: null,
    loadingPromise: null,
    syncing: false,
    error: ''
  };

  let records = loadRecords();
  let toastTimer = null;
  let waitingWorker = null;
  let renderedDateKey = getDateKey(new Date());
  let cloudSaveTimer = null;

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function getDateKey(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function parseDateKey(dateKey) {
    const [year, month, day] = dateKey.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  function formatTime(isoString) {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  function formatDateTitle(dateKey) {
    return parseDateKey(dateKey).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  }

  function formatHistoryDate(dateKey) {
    return parseDateKey(dateKey).toLocaleDateString('zh-CN', {
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
  }

  function formatDuration(clockIn, clockOut) {
    if (!clockIn || !clockOut) return '--';

    const diff = new Date(clockOut).getTime() - new Date(clockIn).getTime();
    if (!Number.isFinite(diff) || diff <= 0) return '0分钟';

    const totalMinutes = Math.round(diff / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours <= 0) return `${minutes}分钟`;
    if (minutes === 0) return `${hours}小时`;
    return `${hours}小时${minutes}分钟`;
  }

  function formatSyncTime(isoString) {
    if (!isoString) return '';

    return new Date(isoString).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  function normalizeRecord(item) {
    if (!item || typeof item.date !== 'string') return null;

    const now = new Date().toISOString();
    const clockIn = item.clockIn || null;
    const clockOut = item.clockOut || null;
    const deletedAt = item.deletedAt || null;
    const updatedAt = item.updatedAt || deletedAt || clockOut || clockIn || now;

    return {
      date: item.date,
      clockIn: deletedAt ? null : clockIn,
      clockOut: deletedAt ? null : clockOut,
      createdAt: item.createdAt || clockIn || updatedAt,
      updatedAt,
      deletedAt
    };
  }

  function loadRecords() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      return parsed.map(normalizeRecord).filter(Boolean);
    } catch (error) {
      console.warn('读取本地记录失败：', error);
      return [];
    }
  }

  function getRecordVersion(record) {
    return record.deletedAt || record.updatedAt || record.clockOut || record.clockIn || record.createdAt || '';
  }

  function saveRecords() {
    const normalizedRecords = records.map(normalizeRecord).filter(Boolean);
    const activeRecords = normalizedRecords
      .filter((record) => !record.deletedAt)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, MAX_HISTORY_ITEMS);
    const deletedRecords = normalizedRecords
      .filter((record) => record.deletedAt)
      .sort((a, b) => getRecordVersion(b).localeCompare(getRecordVersion(a)))
      .slice(0, MAX_DELETED_ITEMS);

    records = [...activeRecords, ...deletedRecords].sort((a, b) => b.date.localeCompare(a.date));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }

  function persistRecords() {
    saveRecords();
    queueCloudSave();
  }

  function createEmptyRecord(date) {
    const now = new Date().toISOString();
    return {
      date,
      clockIn: null,
      clockOut: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    };
  }

  function getTodayRecord(createIfMissing = false) {
    const date = getDateKey(new Date());
    let record = records.find((item) => item.date === date);

    if (record && record.deletedAt && createIfMissing) {
      const freshRecord = createEmptyRecord(date);
      Object.assign(record, freshRecord);
    }

    if (!record && createIfMissing) {
      record = createEmptyRecord(date);
      records.unshift(record);
    }

    if (!record || record.deletedAt) return createEmptyRecord(date);
    return record;
  }

  function vibrate(pattern = 18) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    elements.toast.textContent = message;
    elements.toast.classList.add('show');
    toastTimer = window.setTimeout(() => {
      elements.toast.classList.remove('show');
    }, 2200);
  }

  function loadCloudSettings() {
    try {
      const raw = localStorage.getItem(CLOUD_SETTINGS_KEY);
      if (!raw) return { syncCode: '', lastSyncedAt: null };

      const parsed = JSON.parse(raw);
      return {
        syncCode: typeof parsed.syncCode === 'string' ? parsed.syncCode : '',
        lastSyncedAt: parsed.lastSyncedAt || null
      };
    } catch (error) {
      console.warn('读取云端同步设置失败：', error);
      return { syncCode: '', lastSyncedAt: null };
    }
  }

  function saveCloudSettings() {
    if (!cloudState.syncCode) {
      localStorage.removeItem(CLOUD_SETTINGS_KEY);
      return;
    }

    localStorage.setItem(CLOUD_SETTINGS_KEY, JSON.stringify({
      syncCode: cloudState.syncCode,
      lastSyncedAt: cloudState.lastSyncedAt
    }));
  }

  function getFirebaseConfig() {
    return cloudConfig.firebase || {};
  }

  function isCloudConfigured() {
    const firebaseConfig = getFirebaseConfig();
    return Boolean(
      firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
    );
  }

  function getCloudCollectionName() {
    return cloudConfig.collectionName || 'workClockHistories';
  }

  function updateConnectionStatus() {
    if (!navigator.onLine) {
      elements.connectionStatus.textContent = '离线可用';
    } else if (cloudState.configured && cloudState.syncCode) {
      elements.connectionStatus.textContent = '云端同步已开启';
    } else if (cloudState.configured) {
      elements.connectionStatus.textContent = '本地存储 · 可连接云端';
    } else {
      elements.connectionStatus.textContent = '本地离线存储';
    }

    renderCloudControls();
  }

  function renderCloudControls() {
    if (!elements.cloudStatus) return;

    const connected = Boolean(cloudState.configured && cloudState.syncCode);
    let statusText = '未配置';
    let state = 'off';

    elements.cloudSyncButton.disabled = true;
    elements.cloudConnectButton.disabled = !cloudState.configured || cloudState.syncing;
    elements.cloudCodeInput.disabled = !cloudState.configured || cloudState.syncing;
    elements.cloudDisconnectButton.hidden = !connected;

    if (!cloudState.configured) {
      statusText = '需要 cloud-config.js';
    } else if (!navigator.onLine) {
      statusText = connected ? '离线，稍后同步' : '离线';
      state = 'offline';
    } else if (!connected) {
      statusText = '输入同步码连接';
    } else if (cloudState.syncing) {
      statusText = '正在同步';
      state = 'syncing';
    } else if (cloudState.error) {
      statusText = cloudState.error;
      state = 'error';
      elements.cloudSyncButton.disabled = false;
    } else {
      statusText = cloudState.lastSyncedAt ? `上次同步 ${formatSyncTime(cloudState.lastSyncedAt)}` : '等待首次同步';
      state = 'ready';
      elements.cloudSyncButton.disabled = false;
    }

    elements.cloudStatus.textContent = statusText;
    elements.cloudSyncPanel.dataset.state = state;
    elements.cloudDot.className = `cloud-dot ${state}`;
  }

  function updateClock() {
    const now = new Date();
    elements.currentTime.textContent = now.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const nextDateKey = getDateKey(now);
    if (nextDateKey !== renderedDateKey) {
      renderedDateKey = nextDateKey;
      render();
    }
  }

  function renderToday() {
    const record = getTodayRecord();
    elements.todayTitle.textContent = formatDateTitle(record.date);
    elements.todayIn.textContent = formatTime(record.clockIn);
    elements.todayOut.textContent = formatTime(record.clockOut);
    elements.todayDuration.textContent = formatDuration(record.clockIn, record.clockOut);

    elements.todayStatus.classList.remove('working', 'done');

    if (record.clockIn && record.clockOut) {
      elements.todayStatus.textContent = '今日已完成';
      elements.todayStatus.classList.add('done');
    } else if (record.clockIn) {
      elements.todayStatus.textContent = '已上班';
      elements.todayStatus.classList.add('working');
    } else {
      elements.todayStatus.textContent = '待打卡';
    }

    elements.clockInButton.disabled = Boolean(record.clockIn);
    elements.clockOutButton.disabled = !record.clockIn || Boolean(record.clockOut);
  }

  function getVisibleRecords() {
    return records
      .filter((record) => !record.deletedAt && (record.clockIn || record.clockOut))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  function renderHistory() {
    const visibleRecords = getVisibleRecords();

    if (visibleRecords.length === 0) {
      elements.historyList.innerHTML = '<div class="empty-state">还没有打卡记录。<br>点击“上班打卡”开始记录第一天。</div>';
      return;
    }

    elements.historyList.innerHTML = visibleRecords.map((record) => {
      const duration = formatDuration(record.clockIn, record.clockOut);

      return `
        <article class="history-item">
          <div>
            <div class="history-date">${formatHistoryDate(record.date)}</div>
            <div class="history-meta">上班 ${formatTime(record.clockIn)} · 下班 ${formatTime(record.clockOut)}</div>
          </div>

          <div class="history-actions">
            <div class="history-duration">${duration}</div>
            <button class="delete-history-btn" data-date="${record.date}">删除</button>
          </div>
        </article>
      `;
    }).join('');
  }

  function renderInstallHint() {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    elements.installHint.hidden = standalone;
  }

  function render() {
    renderToday();
    renderHistory();
    renderInstallHint();
    renderCloudControls();
    saveRecords();
  }

  function clockIn() {
    const now = new Date().toISOString();
    const record = getTodayRecord(true);

    if (record.clockIn) {
      showToast('今天已经上班打卡了');
      return;
    }

    record.clockIn = now;
    record.updatedAt = now;
    record.deletedAt = null;
    persistRecords();
    render();
    vibrate([18, 30, 18]);
    showToast(`上班打卡成功：${formatTime(now)}`);
  }

  function clockOut() {
    const now = new Date().toISOString();
    const record = getTodayRecord(false);

    if (!record.clockIn) {
      showToast('请先完成上班打卡');
      return;
    }

    if (record.clockOut) {
      showToast('今天已经下班打卡了');
      return;
    }

    record.clockOut = now;
    record.updatedAt = now;
    record.deletedAt = null;
    persistRecords();
    render();
    vibrate([18, 30, 18]);
    showToast(`下班打卡成功：${formatTime(now)}`);
  }

  function deleteHistoryRecord(date) {
    const now = new Date().toISOString();
    const record = records.find((item) => item.date === date);

    if (record) {
      record.clockIn = null;
      record.clockOut = null;
      record.updatedAt = now;
      record.deletedAt = now;
    } else {
      records.push({
        date,
        clockIn: null,
        clockOut: null,
        createdAt: now,
        updatedAt: now,
        deletedAt: now
      });
    }

    persistRecords();
    render();
    showToast('记录已删除');
  }

  function csvEscape(value) {
    const text = String(value ?? '');
    if (/[,"\n\r]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  }

  function exportCSV() {
    const rows = [
      ['日期', '上班时间', '下班时间', '工时'],
      ...getVisibleRecords().map((record) => [
        record.date,
        formatTime(record.clockIn),
        formatTime(record.clockOut),
        formatDuration(record.clockIn, record.clockOut)
      ])
    ];

    if (rows.length === 1) {
      showToast('暂无记录可导出');
      return;
    }

    const csv = '\ufeff' + rows.map((row) => row.map(csvEscape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const date = getDateKey(new Date());
    const link = document.createElement('a');
    link.href = url;
    link.download = `work-clock-${date}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast('CSV 已生成');
  }

  function bytesToBase64(bytes) {
    let binary = '';
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  function base64ToBytes(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes;
  }

  async function sha256Hex(text) {
    const data = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(hash)]
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  async function deriveCloudIdentity(syncCode) {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error('当前浏览器不支持加密同步');
    }

    const normalizedCode = syncCode.trim();
    const encoder = new TextEncoder();
    const docHash = await sha256Hex(`${CLOUD_CRYPTO_SALT}:doc:${normalizedCode}`);
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(normalizedCode),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    const cryptoKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode(`${CLOUD_CRYPTO_SALT}:key:${docHash}`),
        iterations: 150000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    return {
      docId: docHash.slice(0, 48),
      cryptoKey
    };
  }

  async function initializeCloudIdentity() {
    if (cloudState.docId && cloudState.cryptoKey) return;
    const identity = await deriveCloudIdentity(cloudState.syncCode);
    cloudState.docId = identity.docId;
    cloudState.cryptoKey = identity.cryptoKey;
  }

  function serializeRecordsForCloud() {
    return records
      .filter((record) => record.clockIn || record.clockOut || record.deletedAt)
      .map((record) => normalizeRecord(record))
      .filter(Boolean);
  }

  async function encryptCloudRecords() {
    const payload = JSON.stringify({
      version: 1,
      savedAt: new Date().toISOString(),
      records: serializeRecordsForCloud()
    });
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedPayload = new TextEncoder().encode(payload);
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cloudState.cryptoKey,
      encodedPayload
    );

    return {
      iv: bytesToBase64(iv),
      data: bytesToBase64(new Uint8Array(encrypted))
    };
  }

  async function decryptCloudRecords(encryptedPayload) {
    if (!encryptedPayload || !encryptedPayload.iv || !encryptedPayload.data) return [];

    try {
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: base64ToBytes(encryptedPayload.iv) },
        cloudState.cryptoKey,
        base64ToBytes(encryptedPayload.data)
      );
      const parsed = JSON.parse(new TextDecoder().decode(decrypted));
      const remoteRecords = Array.isArray(parsed) ? parsed : parsed.records;
      return Array.isArray(remoteRecords) ? remoteRecords.map(normalizeRecord).filter(Boolean) : [];
    } catch (error) {
      throw new Error('同步码不匹配，无法读取云端记录');
    }
  }

  function chooseRecord(currentRecord, nextRecord) {
    if (!currentRecord) return nextRecord;

    const currentVersion = getRecordVersion(currentRecord);
    const nextVersion = getRecordVersion(nextRecord);
    if (nextVersion > currentVersion) return nextRecord;
    if (nextVersion < currentVersion) return currentRecord;

    const currentScore = Number(Boolean(currentRecord.clockIn)) + Number(Boolean(currentRecord.clockOut)) + Number(Boolean(currentRecord.deletedAt));
    const nextScore = Number(Boolean(nextRecord.clockIn)) + Number(Boolean(nextRecord.clockOut)) + Number(Boolean(nextRecord.deletedAt));
    return nextScore > currentScore ? nextRecord : currentRecord;
  }

  function mergeRecords(localRecords, remoteRecords) {
    const byDate = new Map();

    [...remoteRecords, ...localRecords].forEach((record) => {
      const normalizedRecord = normalizeRecord(record);
      if (!normalizedRecord) return;
      byDate.set(normalizedRecord.date, chooseRecord(byDate.get(normalizedRecord.date), normalizedRecord));
    });

    return [...byDate.values()].sort((a, b) => b.date.localeCompare(a.date));
  }

  function loadExternalScript(src) {
    return new Promise((resolve, reject) => {
      const existingScript = [...document.scripts].find((script) => script.src === src);
      if (existingScript) {
        if (existingScript.dataset.loaded === 'true') {
          resolve();
          return;
        }
        existingScript.addEventListener('load', () => resolve(), { once: true });
        existingScript.addEventListener('error', () => reject(new Error(`无法加载 ${src}`)), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.dataset.cloudSdk = 'firebase';
      script.addEventListener('load', () => {
        script.dataset.loaded = 'true';
        resolve();
      }, { once: true });
      script.addEventListener('error', () => reject(new Error(`无法加载 ${src}`)), { once: true });
      document.head.appendChild(script);
    });
  }

  async function ensureFirebase() {
    if (cloudState.db) return cloudState.db;
    if (cloudState.loadingPromise) return cloudState.loadingPromise;

    cloudState.loadingPromise = (async () => {
      for (const sdkUrl of FIREBASE_SDK_URLS) {
        await loadExternalScript(sdkUrl);
      }

      if (!window.firebase || !window.firebase.firestore) {
        throw new Error('Firebase SDK 未加载');
      }

      const appName = 'work-clock-cloud';
      const existingApp = window.firebase.apps.find((app) => app.name === appName);
      const app = existingApp || window.firebase.initializeApp(getFirebaseConfig(), appName);
      cloudState.db = app.firestore();
      return cloudState.db;
    })();

    try {
      return await cloudState.loadingPromise;
    } finally {
      cloudState.loadingPromise = null;
    }
  }

  async function syncCloud({ silent = false } = {}) {
    if (!cloudState.configured) {
      if (!silent) showToast('请先配置 cloud-config.js');
      renderCloudControls();
      return;
    }

    if (!cloudState.syncCode) {
      if (!silent) showToast('请输入同步码');
      renderCloudControls();
      return;
    }

    if (!navigator.onLine) {
      if (!silent) showToast('当前离线，稍后自动同步');
      renderCloudControls();
      return;
    }

    if (cloudState.syncing) return;

    cloudState.syncing = true;
    cloudState.error = '';
    renderCloudControls();

    try {
      await initializeCloudIdentity();
      const db = await ensureFirebase();
      const documentRef = db.collection(getCloudCollectionName()).doc(cloudState.docId);
      const snapshot = await documentRef.get();
      const remoteRecords = snapshot.exists ? await decryptCloudRecords(snapshot.data().encrypted) : [];

      records = mergeRecords(records, remoteRecords);
      saveRecords();
      render();

      const encrypted = await encryptCloudRecords();
      await documentRef.set({
        app: 'work-clock',
        version: 1,
        clientUpdatedAt: new Date().toISOString(),
        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
        encrypted
      }, { merge: true });

      cloudState.lastSyncedAt = new Date().toISOString();
      saveCloudSettings();
      updateConnectionStatus();
      if (!silent) showToast('云端同步完成');
    } catch (error) {
      console.warn('云端同步失败：', error);
      cloudState.error = error.message || '云端同步失败';
      if (!silent) showToast(cloudState.error);
    } finally {
      cloudState.syncing = false;
      renderCloudControls();
    }
  }

  function queueCloudSave() {
    if (!cloudState.configured || !cloudState.syncCode) return;

    window.clearTimeout(cloudSaveTimer);
    cloudSaveTimer = window.setTimeout(() => {
      syncCloud({ silent: true });
    }, 900);
  }

  async function connectCloud() {
    if (!cloudState.configured) {
      showToast('请先配置 cloud-config.js');
      return;
    }

    const syncCode = elements.cloudCodeInput.value.trim();
    if (syncCode.length < 6) {
      showToast('同步码至少 6 位');
      return;
    }

    cloudState.syncCode = syncCode;
    cloudState.docId = null;
    cloudState.cryptoKey = null;
    cloudState.lastSyncedAt = null;
    cloudState.error = '';
    saveCloudSettings();
    updateConnectionStatus();
    await syncCloud();
  }

  function disconnectCloud() {
    cloudState.syncCode = '';
    cloudState.docId = null;
    cloudState.cryptoKey = null;
    cloudState.lastSyncedAt = null;
    cloudState.error = '';
    elements.cloudCodeInput.value = '';
    saveCloudSettings();
    updateConnectionStatus();
    showToast('已断开云端同步');
  }

  function bootCloudSync() {
    if (cloudState.syncCode) {
      elements.cloudCodeInput.value = cloudState.syncCode;
    }

    renderCloudControls();

    if (cloudState.configured && cloudState.syncCode && navigator.onLine) {
      window.setTimeout(() => {
        syncCloud({ silent: true });
      }, 500);
    }
  }

  function setupServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('./service-worker.js');
        registration.update();

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              waitingWorker = newWorker;
              elements.updateBanner.hidden = false;
            }
          });
        });
      } catch (error) {
        console.warn('Service Worker 注册失败：', error);
      }
    });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }

  elements.clockInButton.addEventListener('click', clockIn);
  elements.clockOutButton.addEventListener('click', clockOut);
  elements.exportButton.addEventListener('click', exportCSV);
  elements.cloudConnectButton.addEventListener('click', connectCloud);
  elements.cloudDisconnectButton.addEventListener('click', disconnectCloud);
  elements.cloudSyncButton.addEventListener('click', () => syncCloud());
  elements.cloudCodeInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      connectCloud();
    }
  });
  elements.historyList.addEventListener('click', (event) => {
    const button = event.target.closest('.delete-history-btn');
    if (!button) return;

    if (!confirm('确定要删除这条打卡记录吗？')) return;
    deleteHistoryRecord(button.dataset.date);
  });
  elements.reloadButton.addEventListener('click', () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  });

  window.addEventListener('online', () => {
    updateConnectionStatus();
    syncCloud({ silent: true });
  });
  window.addEventListener('offline', updateConnectionStatus);

  updateConnectionStatus();
  updateClock();
  render();
  bootCloudSync();
  setupServiceWorker();

  window.setInterval(updateClock, 1000);
})();
