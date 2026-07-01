(() => {
  'use strict';

  const STORAGE_KEY = 'work-clock-records-v1';
  const MAX_HISTORY_ITEMS = 60;

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
    reloadButton: $('#reloadButton')
  };

  let records = loadRecords();
  let toastTimer = null;
  let waitingWorker = null;
  let renderedDateKey = getDateKey(new Date());

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

  function loadRecords() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      return parsed
        .filter((item) => item && typeof item.date === 'string')
        .map((item) => ({
          date: item.date,
          clockIn: item.clockIn || null,
          clockOut: item.clockOut || null,
          createdAt: item.createdAt || item.clockIn || new Date().toISOString(),
          updatedAt: item.updatedAt || item.clockOut || item.clockIn || new Date().toISOString()
        }));
    } catch (error) {
      console.warn('读取本地记录失败：', error);
      return [];
    }
  }

  function saveRecords() {
    records = records
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }

  function createEmptyRecord(date) {
    const now = new Date().toISOString();
    return {
      date,
      clockIn: null,
      clockOut: null,
      createdAt: now,
      updatedAt: now
    };
  }

  function getTodayRecord(createIfMissing = false) {
    const date = getDateKey(new Date());
    let record = records.find((item) => item.date === date);

    if (!record && createIfMissing) {
      record = createEmptyRecord(date);
      records.unshift(record);
    }

    return record || createEmptyRecord(date);
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

  function updateConnectionStatus() {
    elements.connectionStatus.textContent = navigator.onLine ? '本地离线存储' : '离线可用';
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

  function renderHistory() {
    const visibleRecords = records
      .filter((record) => record.clockIn || record.clockOut)
      .sort((a, b) => b.date.localeCompare(a.date));

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
          <div class="history-duration">${duration}</div>
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
    saveRecords();
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
    saveRecords();
    render();
    vibrate([18, 30, 18]);
    showToast(`下班打卡成功：${formatTime(now)}`);
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
      ...records
        .filter((record) => record.clockIn || record.clockOut)
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((record) => [
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
  elements.reloadButton.addEventListener('click', () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  });

  window.addEventListener('online', updateConnectionStatus);
  window.addEventListener('offline', updateConnectionStatus);

  updateConnectionStatus();
  updateClock();
  render();
  setupServiceWorker();

  window.setInterval(updateClock, 1000);
})();
