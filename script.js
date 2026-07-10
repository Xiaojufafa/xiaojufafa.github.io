(() => {
  'use strict';

  const STORAGE_KEY = 'work-clock-records-v1';
  const CLOUD_SETTINGS_KEY = 'work-clock-cloud-settings-v1';
  const LANGUAGE_KEY = 'work-clock-language-v1';
  const ACCOUNT_KEY = 'work-clock-account-v1';
  const DEFAULT_LANGUAGE = 'zh';
  const MAX_HISTORY_ITEMS = 60;
  const CLOUD_CRYPTO_SALT = 'work-clock-cloud-sync-v1';
  const MANAGER_PASSWORD = '01222005';
  const FIREBASE_SDK_URLS = [
    'https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore-compat.js'
  ];
  const TRANSLATIONS = {
    zh: {
      htmlLang: 'zh-CN',
      locale: 'zh-CN',
      documentTitle: '上班打卡',
      metaDescription: '一个极简、离线可用、支持云端同步的工作打卡 PWA。',
      topbarAria: '应用顶部信息',
      languageSwitchAria: '切换语言',
      languageOptionChinese: '切换到中文',
      languageOptionEnglish: '切换到英文',
      appHeading: '公主请上班！',
      todayEyebrow: '今天',
      summaryAria: '今日打卡摘要',
      clockInLabel: '上班',
      clockOutLabel: '下班',
      durationLabel: '今日工时',
      clockInButton: '上班打卡',
      clockOutButton: '下班打卡',
      installHint: '在 iPhone Safari 中点击“分享” → “添加到主屏幕”，即可像 App 一样使用。',
      recordsEyebrow: '记录',
      historyTitle: '历史记录',
      cloudSyncButton: '同步云端',
      exportButton: '导出 CSV',
      cloudTitle: '云端同步',
      syncCodePlaceholder: '同步码',
      syncCodeAria: '云端同步码',
      createSyncCodeButton: '生成同步码',
      copySyncCodeButton: '复制',
      connectButton: '连接',
      disconnectButton: '断开',
      cloudDestinationLabel: '同步位置',
      cloudConsoleLink: '查看数据',
      updateAvailable: '发现新版本',
      reloadButton: '立即更新',
      connectionOffline: '离线可用',
      connectionCloudOn: '云端同步已开启',
      connectionLocalCloudAvailable: '本地存储 · 可连接云端',
      connectionLocalOnly: '本地离线存储',
      cloudNeedsConfig: '需要 cloud-config.js',
      cloudDestinationAfterConnect: '连接后显示 Firestore 位置',
      cloudStatusNotConfigured: '未配置',
      cloudOfflineLater: '离线，稍后同步',
      cloudOffline: '离线',
      cloudInputOrCreateCode: '输入或生成同步码',
      cloudSyncing: '正在同步',
      cloudLastSynced: '上次同步 {time}',
      cloudWaitingFirstSync: '等待首次同步',
      todayStatusDone: '今日已完成',
      todayStatusWorking: '已上班',
      todayStatusPending: '待打卡',
      emptyHistory: '还没有打卡记录。<br>点击“上班打卡”开始记录第一天。',
      historyMeta: '上班 {inTime} · 下班 {outTime}',
      deleteButton: '删除',
      durationZero: '0分钟',
      durationMinutes: '{minutes}分钟',
      durationHours: '{hours}小时',
      durationHoursMinutes: '{hours}小时{minutes}分钟',
      alreadyClockedIn: '今天已经上班打卡了',
      clockInSuccess: '上班打卡成功：{time}',
      clockInFirst: '请先完成上班打卡',
      alreadyClockedOut: '今天已经下班打卡了',
      clockOutSuccess: '下班打卡成功：{time}',
      recordDeleted: '记录已删除',
      csvDateHeader: '日期',
      csvClockInHeader: '上班时间',
      csvClockOutHeader: '下班时间',
      csvDurationHeader: '工时',
      csvNoRecords: '暂无记录可导出',
      csvReady: 'CSV 已生成',
      cryptoUnsupported: '当前浏览器不支持加密同步',
      cloudBadSyncCode: '同步码不匹配，无法读取云端记录',
      loadScriptFailed: '无法加载 {src}',
      firebaseNotLoaded: 'Firebase SDK 未加载',
      cloudConfigMissing: '请先配置 cloud-config.js',
      syncCodeRequired: '请输入同步码',
      offlineAutoSync: '当前离线，稍后自动同步',
      cloudSyncComplete: '云端同步完成',
      cloudSyncFailed: '云端同步失败',
      syncCodeCreatedCopied: '同步码已生成 · 已复制',
      syncCodeCreated: '同步码已生成',
      syncCodeCopied: '同步码已复制',
      copyFailedManual: '复制失败，请手动复制',
      syncCodeTooShort: '同步码至少 6 位',
      cloudDisconnected: '已断开云端同步',
      confirmDelete: '确定要删除这条打卡记录吗？',
      serviceWorkerRegisterFailed: 'Service Worker 注册失败：',
      prepareCloudDestinationFailed: '准备云端同步位置失败：',
      localRecordsLoadFailed: '读取本地记录失败：',
      cloudSyncFailedLog: '云端同步失败：',
      languageChanged: '已切换为中文'
      ,
      setupEyebrow: '第一次使用',
      setupTitle: '设置账号',
      setupCopy: '输入用户名和 4 位数字密码。同步码会自动和这个用户名连接。',
      usernameLabel: '用户名',
      passwordLabel: '4 位数字密码',
      usernamePlaceholder: 'Jocelyn',
      pinPlaceholder: '••••',
      setupButton: '创建账号',
      loginEyebrow: '欢迎回来',
      loginTitle: '用户名',
      nextButton: '下一步',
      enterPasswordTitle: '输入密码',
      clearButton: '清除',
      backButton: '返回',
      backspaceButton: '删除',
      managerEyebrow: '老赖操控',
      managerCopy: '受保护操作需要老赖操控密码。',
      managerModeButton: '老赖操控',
      managerPasswordPlaceholder: '密码',
      managerPasswordLabel: '老赖操控密码',
      managerUnlockButton: '开启',
      resetClockInButton: '重新上班',
      editDurationButton: '修改工时',
      saveDurationButton: '保存',
      workStartLabel: '开始',
      workEndLabel: '结束',
      workStartTwoLabel: '第二段开始',
      workEndTwoLabel: '第二段结束',
      hoursLabel: '小时',
      minutesLabel: '分钟',
      accountLabel: '账号',
      signOutButton: '登出',
      accountRequired: '请先完成账号设置',
      usernameRequired: '请输入用户名',
      passwordMustFour: '密码需要 4 位数字',
      usernameMismatch: '用户名不正确',
      passwordWrong: '密码不正确',
      loginSuccess: '已登录',
      signedOut: '已登出',
      managerPasswordPrompt: '请输入老赖操控密码',
      managerPasswordWrong: '老赖操控密码不正确',
      managerModeOn: '老赖操控已开启',
      managerModeOff: '老赖操控已隐藏',
      managerUnlocked: '老赖操控已解锁',
      resetClockInSuccess: '已重新开始上班打卡',
      durationSaved: '今日工时已修改',
      noDurationToEdit: '请先完成今天的上班打卡'
      ,
      invalidWorkTimeRange: '请检查开始和结束时间',
      partialWorkTimeRange: '第二段需要同时填写开始和结束'
    },
    en: {
      htmlLang: 'en',
      locale: 'en',
      documentTitle: 'Work Clock',
      metaDescription: 'A minimal offline-ready work clock PWA with optional cloud sync.',
      topbarAria: 'App status and time',
      languageSwitchAria: 'Change language',
      languageOptionChinese: 'Switch to Chinese',
      languageOptionEnglish: 'Switch to English',
      appHeading: 'Princess, time for work!',
      todayEyebrow: 'Today',
      summaryAria: "Today's clock summary",
      clockInLabel: 'Clock in',
      clockOutLabel: 'Clock out',
      durationLabel: "Today's hours",
      clockInButton: 'Clock in',
      clockOutButton: 'Clock out',
      installHint: 'In iPhone Safari, tap Share, then Add to Home Screen to use it like an app.',
      recordsEyebrow: 'Records',
      historyTitle: 'History',
      cloudSyncButton: 'Sync cloud',
      exportButton: 'Export CSV',
      cloudTitle: 'Cloud sync',
      syncCodePlaceholder: 'Sync code',
      syncCodeAria: 'Cloud sync code',
      createSyncCodeButton: 'Generate code',
      copySyncCodeButton: 'Copy',
      connectButton: 'Connect',
      disconnectButton: 'Disconnect',
      cloudDestinationLabel: 'Sync location',
      cloudConsoleLink: 'View data',
      updateAvailable: 'New version available',
      reloadButton: 'Update now',
      connectionOffline: 'Available offline',
      connectionCloudOn: 'Cloud sync on',
      connectionLocalCloudAvailable: 'Local storage · Cloud ready',
      connectionLocalOnly: 'Local offline storage',
      cloudNeedsConfig: 'Needs cloud-config.js',
      cloudDestinationAfterConnect: 'Firestore location appears after connecting',
      cloudStatusNotConfigured: 'Not configured',
      cloudOfflineLater: 'Offline, sync later',
      cloudOffline: 'Offline',
      cloudInputOrCreateCode: 'Enter or generate a sync code',
      cloudSyncing: 'Syncing',
      cloudLastSynced: 'Last synced {time}',
      cloudWaitingFirstSync: 'Waiting for first sync',
      todayStatusDone: 'Done today',
      todayStatusWorking: 'Clocked in',
      todayStatusPending: 'Not clocked in',
      emptyHistory: 'No clock records yet.<br>Tap “Clock in” to start your first day.',
      historyMeta: 'In {inTime} · Out {outTime}',
      deleteButton: 'Delete',
      durationZero: '0 min',
      durationMinutes: '{minutes} min',
      durationHours: '{hours} hr',
      durationHoursMinutes: '{hours} hr {minutes} min',
      alreadyClockedIn: 'Already clocked in today',
      clockInSuccess: 'Clocked in at {time}',
      clockInFirst: 'Please clock in first',
      alreadyClockedOut: 'Already clocked out today',
      clockOutSuccess: 'Clocked out at {time}',
      recordDeleted: 'Record deleted',
      csvDateHeader: 'Date',
      csvClockInHeader: 'Clock-in time',
      csvClockOutHeader: 'Clock-out time',
      csvDurationHeader: 'Hours',
      csvNoRecords: 'No records to export',
      csvReady: 'CSV generated',
      cryptoUnsupported: 'This browser does not support encrypted sync',
      cloudBadSyncCode: 'Sync code does not match, so cloud records cannot be read',
      loadScriptFailed: 'Could not load {src}',
      firebaseNotLoaded: 'Firebase SDK did not load',
      cloudConfigMissing: 'Please configure cloud-config.js first',
      syncCodeRequired: 'Please enter a sync code',
      offlineAutoSync: 'Currently offline, automatic sync will retry later',
      cloudSyncComplete: 'Cloud sync complete',
      cloudSyncFailed: 'Cloud sync failed',
      syncCodeCreatedCopied: 'Sync code generated and copied',
      syncCodeCreated: 'Sync code generated',
      syncCodeCopied: 'Sync code copied',
      copyFailedManual: 'Copy failed, please copy it manually',
      syncCodeTooShort: 'Sync code must be at least 6 characters',
      cloudDisconnected: 'Cloud sync disconnected',
      confirmDelete: 'Delete this clock record?',
      serviceWorkerRegisterFailed: 'Service Worker registration failed:',
      prepareCloudDestinationFailed: 'Cloud sync location preparation failed:',
      localRecordsLoadFailed: 'Local records load failed:',
      cloudSyncFailedLog: 'Cloud sync failed:',
      languageChanged: 'Switched to English'
      ,
      setupEyebrow: 'First use',
      setupTitle: 'Set Up Account',
      setupCopy: 'Enter a username and 4 digit password. A sync code will be linked to this username.',
      usernameLabel: 'Username',
      passwordLabel: '4 digit Password',
      usernamePlaceholder: 'Jocelyn',
      pinPlaceholder: '••••',
      setupButton: 'Create Account',
      loginEyebrow: 'Welcome back',
      loginTitle: 'Username',
      nextButton: 'Next',
      enterPasswordTitle: 'Enter Password',
      clearButton: 'Clear',
      backButton: 'Back',
      backspaceButton: 'Delete',
      managerEyebrow: 'Manager',
      managerCopy: 'Protected actions need the Manager password.',
      managerModeButton: 'Manager mode',
      managerPasswordPlaceholder: 'Password',
      managerPasswordLabel: 'Manager password',
      managerUnlockButton: 'Unlock',
      resetClockInButton: 'Clock in again',
      editDurationButton: 'Edit hours',
      saveDurationButton: 'Save',
      workStartLabel: 'Start',
      workEndLabel: 'End',
      workStartTwoLabel: 'Second start',
      workEndTwoLabel: 'Second end',
      hoursLabel: 'Hours',
      minutesLabel: 'Minutes',
      accountLabel: 'Account',
      signOutButton: 'Sign Out',
      accountRequired: 'Please set up your account first',
      usernameRequired: 'Please enter a username',
      passwordMustFour: 'Password must be 4 digits',
      usernameMismatch: 'Username does not match',
      passwordWrong: 'Wrong password',
      loginSuccess: 'Logged in',
      signedOut: 'Signed out',
      managerPasswordPrompt: 'Enter Manager password',
      managerPasswordWrong: 'Wrong Manager password',
      managerModeOn: 'Manager mode on',
      managerModeOff: 'Manager mode hidden',
      managerUnlocked: 'Manager mode unlocked',
      resetClockInSuccess: 'Clock-in reset for another work session',
      durationSaved: "Today's hours updated",
      noDurationToEdit: 'Please clock in first today',
      invalidWorkTimeRange: 'Please check the start and end times',
      partialWorkTimeRange: 'Second range needs both start and end'
    }
  };

  const $ = (selector) => document.querySelector(selector);

  const elements = {
    authShell: $('#authShell'),
    appShell: $('#appShell'),
    setupAccountView: $('#setupAccountView'),
    loginUsernameView: $('#loginUsernameView'),
    loginPasswordView: $('#loginPasswordView'),
    setupAccountForm: $('#setupAccountForm'),
    setupUsername: $('#setupUsername'),
    setupPassword: $('#setupPassword'),
    loginUsernameForm: $('#loginUsernameForm'),
    loginUsername: $('#loginUsername'),
    loginPasswordEyebrow: $('#loginPasswordEyebrow'),
    loginPassword: $('#loginPassword'),
    pinDots: $('#pinDots'),
    pinBackButton: $('#pinBackButton'),
    pinClearButton: $('#pinClearButton'),
    backToUsernameButton: $('#backToUsernameButton'),
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
    cloudCreateButton: $('#cloudCreateButton'),
    copySyncCodeButton: $('#copySyncCodeButton'),
    cloudDestinationText: $('#cloudDestinationText'),
    cloudConsoleLink: $('#cloudConsoleLink'),
    cloudStatus: $('#cloudStatus'),
    cloudDot: $('#cloudDot'),
    cloudSyncPanel: $('#cloudSyncPanel'),
    cloudToggleButton: $('#cloudToggleButton'),
    cloudDetails: $('#cloudDetails'),
    cloudArrow: $('#cloudArrow'),
    accountName: $('#accountName'),
    signOutButton: $('#signOutButton'),
    managerModeButton: $('#managerModeButton'),
    managerPanel: $('#managerPanel'),
    managerUnlockForm: $('#managerUnlockForm'),
    managerPasswordInput: $('#managerPasswordInput'),
    managerActions: $('#managerActions'),
    resetClockInButton: $('#resetClockInButton'),
    editDurationButton: $('#editDurationButton'),
    durationEditor: $('#durationEditor'),
    workStartInput: $('#workStartInput'),
    workEndInput: $('#workEndInput'),
    workStartTwoInput: $('#workStartTwoInput'),
    workEndTwoInput: $('#workEndTwoInput'),
    languageOptions: document.querySelectorAll('[data-language]')
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
  let currentLanguage = loadLanguage();
  let account = loadAccount();
  let authenticated = false;
  let managerModeOpen = false;
  let managerUnlocked = false;
  let cloudDetailsOpen = false;

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function t(key, values = {}) {
    const dictionary = TRANSLATIONS[currentLanguage] || TRANSLATIONS[DEFAULT_LANGUAGE];
    const template = dictionary[key] || TRANSLATIONS[DEFAULT_LANGUAGE][key] || key;

    return template.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? '');
  }

  function loadLanguage() {
    try {
      const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
      if (TRANSLATIONS[savedLanguage]) return savedLanguage;
    } catch (error) {
      // Keep the default language if storage is unavailable.
    }

    return DEFAULT_LANGUAGE;
  }

  function saveLanguage() {
    try {
      localStorage.setItem(LANGUAGE_KEY, currentLanguage);
    } catch (error) {
      // The UI can still switch languages for the current session.
    }
  }

  function loadAccount() {
    try {
      const raw = localStorage.getItem(ACCOUNT_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed.username !== 'string' || typeof parsed.password !== 'string') return null;
      return {
        username: parsed.username,
        password: parsed.password,
        syncCode: typeof parsed.syncCode === 'string' ? parsed.syncCode : '',
        createdAt: parsed.createdAt || new Date().toISOString()
      };
    } catch (error) {
      return null;
    }
  }

  function saveAccount() {
    if (!account) {
      localStorage.removeItem(ACCOUNT_KEY);
      return;
    }

    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  }

  function isFourDigitPassword(value) {
    return /^\d{4}$/.test(value);
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
    return new Date(isoString).toLocaleTimeString(t('locale'), {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  function formatInputTime(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return '';
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function timeInputToIso(dateKey, timeValue) {
    if (!/^\d{2}:\d{2}$/.test(timeValue)) return null;
    const [hour, minute] = timeValue.split(':').map(Number);
    const date = parseDateKey(dateKey);
    date.setHours(hour, minute, 0, 0);
    return date.toISOString();
  }

  function formatDateTitle(dateKey) {
    return parseDateKey(dateKey).toLocaleDateString(t('locale'), {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  }

  function formatHistoryDate(dateKey) {
    return parseDateKey(dateKey).toLocaleDateString(t('locale'), {
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
  }

  function formatMinutesDuration(totalMinutes) {
    if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) return t('durationZero');

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours <= 0) return t('durationMinutes', { minutes });
    if (minutes === 0) return t('durationHours', { hours });
    return t('durationHoursMinutes', { hours, minutes });
  }

  function getRecordSessions(record) {
    if (Array.isArray(record?.sessions) && record.sessions.length > 0) {
      return record.sessions
        .filter((session) => session && (session.clockIn || session.clockOut))
        .map((session) => {
          session.clockIn = session.clockIn || null;
          session.clockOut = session.clockOut || null;
          return session;
        });
    }

    if (record?.clockIn || record?.clockOut) {
      return [{ clockIn: record.clockIn || null, clockOut: record.clockOut || null }];
    }

    return [];
  }

  function getRecordClockIn(record) {
    return getRecordSessions(record)[0]?.clockIn || null;
  }

  function getRecordClockOut(record) {
    const completedSession = [...getRecordSessions(record)].reverse().find((session) => session.clockOut);
    return completedSession?.clockOut || null;
  }

  function getActiveSession(record) {
    return getRecordSessions(record).find((session) => session.clockIn && !session.clockOut) || null;
  }

  function getDurationMinutes(record) {
    if (Number.isFinite(record?.manualDurationMinutes)) return record.manualDurationMinutes;

    return getRecordSessions(record).reduce((total, session) => {
      if (!session.clockIn || !session.clockOut) return total;
      const diff = new Date(session.clockOut).getTime() - new Date(session.clockIn).getTime();
      if (!Number.isFinite(diff) || diff <= 0) return total;
      return total + Math.round(diff / 60000);
    }, 0);
  }

  function formatDuration(recordOrClockIn, clockOut) {
    if (typeof recordOrClockIn === 'object' && recordOrClockIn !== null) {
      const sessions = getRecordSessions(recordOrClockIn);
      if (sessions.length === 0) return '--';
      return formatMinutesDuration(getDurationMinutes(recordOrClockIn));
    }

    if (!recordOrClockIn || !clockOut) return '--';
    const diff = new Date(clockOut).getTime() - new Date(recordOrClockIn).getTime();
    return formatMinutesDuration(Math.round(diff / 60000));
  }

  function formatSyncTime(isoString) {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString(t('locale'), {
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
    const sessions = getRecordSessions(item);
    const deletedAt = item.deletedAt || null;
    const updatedAt = item.updatedAt || deletedAt || clockOut || clockIn || now;

    return {
      date: item.date,
      clockIn: deletedAt ? null : (sessions[0]?.clockIn || clockIn),
      clockOut: deletedAt ? null : (getRecordClockOut({ sessions }) || clockOut),
      sessions: deletedAt ? [] : sessions,
      manualDurationMinutes: Number.isFinite(item.manualDurationMinutes) ? item.manualDurationMinutes : null,
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
      console.warn(t('localRecordsLoadFailed'), error);
      return [];
    }
  }

  function getRecordVersion(record) {
    return record.deletedAt || record.updatedAt || record.clockOut || record.clockIn || record.createdAt || '';
  }

  function saveRecords() {
    const byDate = new Map();

    records.map(normalizeRecord).filter(Boolean).forEach((record) => {
      const current = byDate.get(record.date);
      if (!current || getRecordVersion(record) >= getRecordVersion(current)) {
        byDate.set(record.date, record);
      }
    });

    const activeRecords = [...byDate.values()]
      .filter((record) => !record.deletedAt)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, MAX_HISTORY_ITEMS);
    const deletedRecords = [...byDate.values()]
      .filter((record) => record.deletedAt)
      .sort((a, b) => getRecordVersion(b).localeCompare(getRecordVersion(a)))
      .slice(0, MAX_HISTORY_ITEMS);

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
      sessions: [],
      manualDurationMinutes: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    };
  }

  function getTodayRecord(createIfMissing = false) {
    const date = getDateKey(new Date());
    let record = records.find((item) => item.date === date);

    if (record && record.deletedAt && createIfMissing) {
      Object.assign(record, createEmptyRecord(date));
    }

    if (!record && createIfMissing) {
      record = createEmptyRecord(date);
      records.unshift(record);
    }

    if (!record || record.deletedAt) return createEmptyRecord(date);
    return record;
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    elements.toast.textContent = message;
    elements.toast.classList.add('show');
    toastTimer = window.setTimeout(() => {
      elements.toast.classList.remove('show');
    }, 2200);
  }

  function showAuthView(viewName) {
    elements.authShell.hidden = false;
    elements.appShell.hidden = true;
    elements.setupAccountView.hidden = viewName !== 'setup';
    elements.loginUsernameView.hidden = viewName !== 'username';
    elements.loginPasswordView.hidden = viewName !== 'password';

    window.setTimeout(() => {
      if (viewName === 'setup') elements.setupUsername.focus();
      if (viewName === 'username') elements.loginUsername.focus();
      if (viewName === 'password') elements.loginPassword.focus();
    }, 50);
  }

  function showApp() {
    elements.authShell.hidden = true;
    elements.appShell.hidden = false;
    authenticated = true;
    renderAccount();
    renderManagerMode();
    render();
  }

  function renderAccount() {
    if (elements.accountName) {
      const syncText = account?.syncCode ? ` · ${account.syncCode}` : '';
      elements.accountName.textContent = account ? `${account.username}${syncText}` : '--';
    }

    if (account?.syncCode && cloudState.syncCode !== account.syncCode) {
      cloudState.syncCode = account.syncCode;
      elements.cloudCodeInput.value = account.syncCode;
      saveCloudSettings();
      prepareCloudIdentityForDisplay();
    }
  }

  function renderManagerMode() {
    elements.managerPanel.hidden = !managerModeOpen;
    elements.managerUnlockForm.hidden = !managerModeOpen || managerUnlocked;
    elements.managerActions.hidden = !managerModeOpen || !managerUnlocked;
    elements.durationEditor.hidden = true;
    elements.managerModeButton.classList.toggle('active', managerModeOpen);
    elements.managerModeButton.setAttribute('aria-pressed', String(managerModeOpen));
  }

  function renderCloudDetails() {
    elements.cloudDetails.hidden = !cloudDetailsOpen;
    elements.cloudToggleButton.setAttribute('aria-expanded', String(cloudDetailsOpen));
    elements.cloudArrow.classList.toggle('open', cloudDetailsOpen);
  }

  function toggleCloudDetails() {
    cloudDetailsOpen = !cloudDetailsOpen;
    renderCloudDetails();
  }

  function renderAuthGate() {
    if (!account) {
      showAuthView('setup');
      return;
    }

    if (!authenticated) {
      elements.loginUsername.value = account.username;
      showAuthView('username');
      return;
    }

    showApp();
  }

  function setupAccount(event) {
    event.preventDefault();
    const username = elements.setupUsername.value.trim();
    const password = elements.setupPassword.value.trim();

    if (!username) {
      showToast(t('usernameRequired'));
      return;
    }

    if (!isFourDigitPassword(password)) {
      showToast(t('passwordMustFour'));
      return;
    }

    const syncCode = cloudState.syncCode || generateSyncCode();
    account = {
      username,
      password,
      syncCode,
      createdAt: new Date().toISOString()
    };
    cloudState.syncCode = syncCode;
    elements.cloudCodeInput.value = syncCode;
    saveAccount();
    saveCloudSettings();
    prepareCloudIdentityForDisplay();
    showApp();
    showToast(t('loginSuccess'));
  }

  function continueLogin(event) {
    event.preventDefault();
    if (!account) {
      showToast(t('accountRequired'));
      return;
    }

    if (elements.loginUsername.value.trim() !== account.username) {
      showToast(t('usernameMismatch'));
      return;
    }

    elements.loginPasswordEyebrow.textContent = account.username;
    elements.loginPassword.value = '';
    updatePinDots();
    showAuthView('password');
  }

  function updatePinDots() {
    const length = elements.loginPassword.value.length;
    elements.pinDots.querySelectorAll('span').forEach((dot, index) => {
      dot.classList.toggle('filled', index < length);
    });
  }

  function tryPasswordLogin() {
    updatePinDots();
    if (elements.loginPassword.value.length < 4) return;

    if (elements.loginPassword.value === account.password) {
      showApp();
      showToast(t('loginSuccess'));
      return;
    }

    elements.loginPassword.value = '';
    updatePinDots();
    vibrate([40, 40, 40]);
    showToast(t('passwordWrong'));
  }

  function signOut() {
    account = null;
    authenticated = false;
    managerModeOpen = false;
    managerUnlocked = false;
    cloudState.syncCode = '';
    elements.cloudCodeInput.value = '';
    saveAccount();
    saveCloudSettings();
    updateConnectionStatus();
    renderAuthGate();
    showToast(t('signedOut'));
  }

  function requireManagerPassword() {
    if (managerUnlocked) return true;
    showToast(t('managerPasswordPrompt'));
    if (managerModeOpen) elements.managerPasswordInput.focus();
    return false;
  }

  function toggleManagerMode() {
    if (managerModeOpen) {
      managerModeOpen = false;
      managerUnlocked = false;
      elements.managerPasswordInput.value = '';
      renderManagerMode();
      showToast(t('managerModeOff'));
      return;
    }

    managerModeOpen = true;
    renderManagerMode();
    showToast(t('managerModeOn'));
    window.setTimeout(() => elements.managerPasswordInput.focus(), 50);
  }

  function unlockManagerMode(event) {
    event.preventDefault();

    if (elements.managerPasswordInput.value !== MANAGER_PASSWORD) {
      elements.managerPasswordInput.value = '';
      vibrate([40, 40, 40]);
      showToast(t('managerPasswordWrong'));
      return;
    }

    managerUnlocked = true;
    elements.managerPasswordInput.value = '';
    renderManagerMode();
    showToast(t('managerUnlocked'));
  }

  function renderLanguageControls() {
    elements.languageOptions.forEach((button) => {
      const language = button.dataset.language;
      const active = language === currentLanguage;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
      button.setAttribute(
        'aria-label',
        language === 'zh' ? t('languageOptionChinese') : t('languageOptionEnglish')
      );
    });
  }

  function renderStaticText() {
    document.documentElement.lang = t('htmlLang');
    document.title = t('documentTitle');

    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.content = t('metaDescription');
    }

    const appleTitleMeta = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (appleTitleMeta) {
      appleTitleMeta.content = t('documentTitle');
    }

    document.querySelectorAll('[data-i18n]').forEach((node) => {
      node.textContent = t(node.dataset.i18n);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
      node.placeholder = t(node.dataset.i18nPlaceholder);
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach((node) => {
      node.setAttribute('aria-label', t(node.dataset.i18nAriaLabel));
    });

    renderLanguageControls();
  }

  function setLanguage(language) {
    if (!TRANSLATIONS[language]) return;

    const changed = currentLanguage !== language;
    currentLanguage = language;
    saveLanguage();
    renderStaticText();
    updateClock();
    updateConnectionStatus();
    render();

    if (changed) {
      showToast(t('languageChanged'));
    }
  }

  function vibrate(pattern = 18) {
    if ('vibrate' in navigator) navigator.vibrate(pattern);
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

  function generateSyncCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const randomValues = new Uint32Array(16);

    if (window.crypto?.getRandomValues) {
      window.crypto.getRandomValues(randomValues);
    } else {
      for (let index = 0; index < randomValues.length; index += 1) {
        randomValues[index] = Math.floor(Math.random() * 4294967296);
      }
    }

    const codeChars = [];
    for (let index = 0; index < randomValues.length; index += 1) {
      if (index > 0 && index % 4 === 0) codeChars.push('-');
      codeChars.push(chars[randomValues[index] % chars.length]);
    }

    return `WC-${codeChars.join('')}`;
  }

  async function copyText(text) {
    if (!text) return false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (error) {
      // Fall back to a temporary text field.
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-999px';
    document.body.appendChild(textarea);
    textarea.select();

    try {
      return document.execCommand('copy');
    } catch (error) {
      return false;
    } finally {
      textarea.remove();
    }
  }

  async function sha256Hex(text) {
    const data = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(hash)]
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  async function deriveCloudIdentity(syncCode) {
    if (!window.crypto?.subtle) {
      throw new Error(t('cryptoUnsupported'));
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

  function renderCloudDestination() {
    const firebaseConfig = getFirebaseConfig();
    const hasDestination = Boolean(cloudState.configured && cloudState.syncCode && cloudState.docId);

    if (!cloudState.configured) {
      elements.cloudDestinationText.textContent = t('cloudNeedsConfig');
    } else if (!hasDestination) {
      elements.cloudDestinationText.textContent = t('cloudDestinationAfterConnect');
    } else {
      elements.cloudDestinationText.textContent = `Firebase: ${firebaseConfig.projectId} / ${getCloudCollectionName()} / ${cloudState.docId}`;
    }

    elements.cloudConsoleLink.hidden = !hasDestination;
    elements.cloudConsoleLink.href = hasDestination
      ? `https://console.firebase.google.com/project/${encodeURIComponent(firebaseConfig.projectId)}/firestore/data/~2F${encodeURIComponent(getCloudCollectionName())}~2F${encodeURIComponent(cloudState.docId)}`
      : '#';
  }

  async function prepareCloudIdentityForDisplay() {
    if (!cloudState.configured || !cloudState.syncCode) {
      renderCloudDestination();
      return;
    }

    try {
      await initializeCloudIdentity();
    } catch (error) {
      console.warn(t('prepareCloudDestinationFailed'), error);
    } finally {
      renderCloudDestination();
    }
  }

  function updateConnectionStatus() {
    if (!navigator.onLine) {
      elements.connectionStatus.textContent = t('connectionOffline');
    } else if (cloudState.configured && cloudState.syncCode) {
      elements.connectionStatus.textContent = t('connectionCloudOn');
    } else if (cloudState.configured) {
      elements.connectionStatus.textContent = t('connectionLocalCloudAvailable');
    } else {
      elements.connectionStatus.textContent = t('connectionLocalOnly');
    }

    renderCloudControls();
  }

  function renderCloudControls() {
    const connected = Boolean(cloudState.configured && cloudState.syncCode);
    let statusText = t('cloudStatusNotConfigured');
    let state = 'off';

    elements.cloudSyncButton.disabled = true;
    elements.cloudConnectButton.disabled = !cloudState.configured || cloudState.syncing;
    elements.cloudCodeInput.disabled = !cloudState.configured || cloudState.syncing;
    elements.cloudCreateButton.disabled = !cloudState.configured || cloudState.syncing;
    elements.copySyncCodeButton.disabled = !cloudState.syncCode && !elements.cloudCodeInput.value.trim();
    elements.cloudDisconnectButton.hidden = !connected;

    if (!cloudState.configured) {
      statusText = t('cloudNeedsConfig');
    } else if (!navigator.onLine) {
      statusText = connected ? t('cloudOfflineLater') : t('cloudOffline');
      state = 'offline';
    } else if (!connected) {
      statusText = t('cloudInputOrCreateCode');
    } else if (cloudState.syncing) {
      statusText = t('cloudSyncing');
      state = 'syncing';
    } else if (cloudState.error) {
      statusText = cloudState.error;
      state = 'error';
      elements.cloudSyncButton.disabled = false;
    } else {
      statusText = cloudState.lastSyncedAt
        ? t('cloudLastSynced', { time: formatSyncTime(cloudState.lastSyncedAt) })
        : t('cloudWaitingFirstSync');
      state = 'ready';
      elements.cloudSyncButton.disabled = false;
    }

    elements.cloudStatus.textContent = statusText;
    elements.cloudSyncPanel.dataset.state = state;
    elements.cloudDot.className = `cloud-dot ${state}`;
    renderCloudDestination();
  }

  function updateClock() {
    const now = new Date();
    elements.currentTime.textContent = now.toLocaleTimeString(t('locale'), {
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
    const activeSession = getActiveSession(record);
    elements.todayTitle.textContent = formatDateTitle(record.date);
    elements.todayIn.textContent = formatTime(getRecordClockIn(record));
    elements.todayOut.textContent = formatTime(getRecordClockOut(record));
    elements.todayDuration.textContent = formatDuration(record);

    elements.todayStatus.classList.remove('working', 'done');

    if (getRecordClockIn(record) && getRecordClockOut(record) && !activeSession) {
      elements.todayStatus.textContent = t('todayStatusDone');
      elements.todayStatus.classList.add('done');
    } else if (activeSession) {
      elements.todayStatus.textContent = t('todayStatusWorking');
      elements.todayStatus.classList.add('working');
    } else {
      elements.todayStatus.textContent = t('todayStatusPending');
    }

    elements.clockInButton.disabled = Boolean(activeSession) || Boolean(getRecordClockIn(record));
    elements.clockOutButton.disabled = !activeSession;
  }

  function getVisibleRecords() {
    return records
      .filter((record) => !record.deletedAt && (record.clockIn || record.clockOut))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  function renderHistory() {
    const visibleRecords = getVisibleRecords();

    if (visibleRecords.length === 0) {
      elements.historyList.innerHTML = `<div class="empty-state">${t('emptyHistory')}</div>`;
      return;
    }

    elements.historyList.innerHTML = visibleRecords.map((record) => `
      <article class="history-item">
        <div>
          <div class="history-date">${formatHistoryDate(record.date)}</div>
          <div class="history-meta">${t('historyMeta', {
            inTime: formatTime(getRecordClockIn(record)),
            outTime: formatTime(getRecordClockOut(record))
          })}</div>
        </div>
        <div class="history-actions">
          <div class="history-duration">${formatDuration(record)}</div>
          <button class="delete-history-btn" data-date="${record.date}">${t('deleteButton')}</button>
        </div>
      </article>
    `).join('');
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
    renderCloudDetails();
  }

  function clockIn() {
    const now = new Date().toISOString();
    const record = getTodayRecord(true);

    if (getRecordClockIn(record) || getActiveSession(record)) {
      showToast(t('alreadyClockedIn'));
      return;
    }

    record.clockIn = now;
    record.clockOut = null;
    record.sessions = [{ clockIn: now, clockOut: null }];
    record.manualDurationMinutes = null;
    record.updatedAt = now;
    record.deletedAt = null;
    persistRecords();
    render();
    vibrate([18, 30, 18]);
    showToast(t('clockInSuccess', { time: formatTime(now) }));
  }

  function clockOut() {
    const now = new Date().toISOString();
    const record = getTodayRecord(false);
    const activeSession = getActiveSession(record);

    if (!activeSession) {
      showToast(t('clockInFirst'));
      return;
    }

    activeSession.clockOut = now;
    record.clockIn = getRecordClockIn(record);
    record.clockOut = now;
    record.updatedAt = now;
    record.deletedAt = null;
    persistRecords();
    render();
    vibrate([18, 30, 18]);
    showToast(t('clockOutSuccess', { time: formatTime(now) }));
  }

  function deleteHistoryRecord(date) {
    const now = new Date().toISOString();
    const record = records.find((item) => item.date === date);

    if (record) {
      record.clockIn = null;
      record.clockOut = null;
      record.sessions = [];
      record.manualDurationMinutes = null;
      record.updatedAt = now;
      record.deletedAt = now;
    }

    persistRecords();
    render();
    showToast(t('recordDeleted'));
  }

  function resetClockInToday() {
    if (!requireManagerPassword()) return;

    const now = new Date().toISOString();
    const record = getTodayRecord(true);
    const sessions = getRecordSessions(record);
    const activeSession = sessions.find((session) => session.clockIn && !session.clockOut);

    if (activeSession) {
      activeSession.clockOut = now;
    }

    sessions.push({ clockIn: now, clockOut: null });
    record.sessions = sessions;
    record.clockIn = sessions[0]?.clockIn || now;
    record.clockOut = getRecordClockOut(record);
    record.manualDurationMinutes = null;
    record.updatedAt = now;
    record.deletedAt = null;
    persistRecords();
    render();
    showToast(t('resetClockInSuccess'));
  }

  function openDurationEditor() {
    if (!requireManagerPassword()) return;

    const record = getTodayRecord(true);
    const sessions = getRecordSessions(record);
    elements.workStartInput.value = formatInputTime(sessions[0]?.clockIn || record.clockIn);
    elements.workEndInput.value = formatInputTime(sessions[0]?.clockOut || record.clockOut);
    elements.workStartTwoInput.value = formatInputTime(sessions[1]?.clockIn);
    elements.workEndTwoInput.value = formatInputTime(sessions[1]?.clockOut);
    elements.durationEditor.hidden = false;
    elements.workStartInput.focus();
  }

  function saveManualDuration(event) {
    event.preventDefault();

    const record = getTodayRecord(true);
    const dateKey = record.date;
    const firstStart = elements.workStartInput.value;
    const firstEnd = elements.workEndInput.value;
    const secondStart = elements.workStartTwoInput.value;
    const secondEnd = elements.workEndTwoInput.value;

    if (!firstStart || !firstEnd) {
      showToast(t('invalidWorkTimeRange'));
      return;
    }

    if ((secondStart && !secondEnd) || (!secondStart && secondEnd)) {
      showToast(t('partialWorkTimeRange'));
      return;
    }

    const sessions = [
      {
        clockIn: timeInputToIso(dateKey, firstStart),
        clockOut: timeInputToIso(dateKey, firstEnd)
      }
    ];

    if (secondStart && secondEnd) {
      sessions.push({
        clockIn: timeInputToIso(dateKey, secondStart),
        clockOut: timeInputToIso(dateKey, secondEnd)
      });
    }

    const invalidSession = sessions.some((session) => {
      const start = new Date(session.clockIn).getTime();
      const end = new Date(session.clockOut).getTime();
      return !Number.isFinite(start) || !Number.isFinite(end) || end <= start;
    });

    if (invalidSession) {
      showToast(t('invalidWorkTimeRange'));
      return;
    }

    record.sessions = sessions;
    record.clockIn = sessions[0].clockIn;
    record.clockOut = sessions[sessions.length - 1].clockOut;
    record.manualDurationMinutes = null;
    record.deletedAt = null;
    record.updatedAt = new Date().toISOString();
    persistRecords();
    render();
    elements.durationEditor.hidden = true;
    showToast(t('durationSaved'));
  }

  function csvEscape(value) {
    const text = String(value ?? '');
    if (/[,"\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
    return text;
  }

  function exportCSV() {
    const rows = [
      [t('csvDateHeader'), t('csvClockInHeader'), t('csvClockOutHeader'), t('csvDurationHeader')],
      ...getVisibleRecords().map((record) => [
        record.date,
        formatTime(getRecordClockIn(record)),
        formatTime(getRecordClockOut(record)),
        formatDuration(record)
      ])
    ];

    if (rows.length === 1) {
      showToast(t('csvNoRecords'));
      return;
    }

    const csv = '\ufeff' + rows.map((row) => row.map(csvEscape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `work-clock-${getDateKey(new Date())}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast(t('csvReady'));
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

  function serializeRecordsForCloud() {
    return records
      .filter((record) => record.clockIn || record.clockOut || record.deletedAt)
      .map(normalizeRecord)
      .filter(Boolean);
  }

  async function encryptCloudRecords() {
    const payload = JSON.stringify({
      version: 1,
      savedAt: new Date().toISOString(),
      records: serializeRecordsForCloud()
    });
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cloudState.cryptoKey,
      new TextEncoder().encode(payload)
    );

    return {
      iv: bytesToBase64(iv),
      data: bytesToBase64(new Uint8Array(encrypted))
    };
  }

  async function decryptCloudRecords(encryptedPayload) {
    if (!encryptedPayload?.iv || !encryptedPayload?.data) return [];

    try {
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: base64ToBytes(encryptedPayload.iv) },
        cloudState.cryptoKey,
        base64ToBytes(encryptedPayload.data)
      );
      const parsed = JSON.parse(new TextDecoder().decode(decrypted));
      return Array.isArray(parsed.records) ? parsed.records.map(normalizeRecord).filter(Boolean) : [];
    } catch (error) {
      throw new Error(t('cloudBadSyncCode'));
    }
  }

  function chooseRecord(currentRecord, nextRecord) {
    if (!currentRecord) return nextRecord;
    return getRecordVersion(nextRecord) > getRecordVersion(currentRecord) ? nextRecord : currentRecord;
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
        existingScript.addEventListener('load', resolve, { once: true });
        existingScript.addEventListener('error', reject, { once: true });
        if (existingScript.dataset.loaded === 'true') resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.addEventListener('load', () => {
        script.dataset.loaded = 'true';
        resolve();
      }, { once: true });
      script.addEventListener('error', () => reject(new Error(t('loadScriptFailed', { src }))), { once: true });
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

      if (!window.firebase?.firestore) {
        throw new Error(t('firebaseNotLoaded'));
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
      if (!silent) showToast(t('cloudConfigMissing'));
      renderCloudControls();
      return;
    }

    if (!cloudState.syncCode) {
      if (!silent) showToast(t('syncCodeRequired'));
      renderCloudControls();
      return;
    }

    if (!navigator.onLine) {
      if (!silent) showToast(t('offlineAutoSync'));
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

      await documentRef.set({
        app: 'work-clock',
        version: 1,
        clientUpdatedAt: new Date().toISOString(),
        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
        encrypted: await encryptCloudRecords()
      }, { merge: true });

      cloudState.lastSyncedAt = new Date().toISOString();
      saveCloudSettings();
      updateConnectionStatus();
      if (!silent) showToast(t('cloudSyncComplete'));
    } catch (error) {
      console.warn(t('cloudSyncFailedLog'), error);
      cloudState.error = error.message || t('cloudSyncFailed');
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

  async function createSyncCode() {
    if (!cloudState.configured) {
      showToast(t('cloudConfigMissing'));
      return;
    }

    const syncCode = generateSyncCode();
    cloudState.syncCode = syncCode;
    cloudState.docId = null;
    cloudState.cryptoKey = null;
    cloudState.lastSyncedAt = null;
    cloudState.error = '';
    elements.cloudCodeInput.value = syncCode;
    if (account) {
      account.syncCode = syncCode;
      saveAccount();
      renderAccount();
    }
    saveCloudSettings();
    await prepareCloudIdentityForDisplay();
    updateConnectionStatus();

    const copied = await copyText(syncCode);
    showToast(copied ? t('syncCodeCreatedCopied') : t('syncCodeCreated'));
  }

  async function copyCurrentSyncCode() {
    const syncCode = cloudState.syncCode || elements.cloudCodeInput.value.trim();
    const copied = await copyText(syncCode);
    showToast(copied ? t('syncCodeCopied') : t('copyFailedManual'));
  }

  function setVisibleSyncCode(syncCode) {
    elements.cloudCodeInput.value = syncCode;
    renderCloudControls();
  }

  async function connectCloud() {
    if (!cloudState.configured) {
      showToast(t('cloudConfigMissing'));
      return;
    }

    const syncCode = elements.cloudCodeInput.value.trim();
    if (syncCode.length < 6) {
      showToast(t('syncCodeTooShort'));
      return;
    }

    cloudState.syncCode = syncCode;
    cloudState.docId = null;
    cloudState.cryptoKey = null;
    cloudState.lastSyncedAt = null;
    cloudState.error = '';
    if (account) {
      account.syncCode = syncCode;
      saveAccount();
      renderAccount();
    }
    saveCloudSettings();
    setVisibleSyncCode(syncCode);
    await prepareCloudIdentityForDisplay();
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
    if (account) {
      account.syncCode = '';
      saveAccount();
      renderAccount();
    }
    saveCloudSettings();
    updateConnectionStatus();
    showToast(t('cloudDisconnected'));
  }

  function bootCloudSync() {
    if (cloudState.syncCode) {
      elements.cloudCodeInput.value = cloudState.syncCode;
      prepareCloudIdentityForDisplay();
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
        console.warn(t('serviceWorkerRegisterFailed'), error);
      }
    });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }

  elements.clockInButton.addEventListener('click', clockIn);
  elements.clockOutButton.addEventListener('click', clockOut);
  elements.setupAccountForm.addEventListener('submit', setupAccount);
  elements.loginUsernameForm.addEventListener('submit', continueLogin);
  elements.loginPassword.addEventListener('input', tryPasswordLogin);
  document.querySelectorAll('[data-pin]').forEach((button) => {
    button.addEventListener('click', () => {
      if (elements.loginPassword.value.length >= 4) return;
      elements.loginPassword.value += button.dataset.pin;
      tryPasswordLogin();
    });
  });
  elements.pinBackButton.addEventListener('click', () => {
    elements.loginPassword.value = elements.loginPassword.value.slice(0, -1);
    updatePinDots();
  });
  elements.pinClearButton.addEventListener('click', () => {
    elements.loginPassword.value = '';
    updatePinDots();
  });
  elements.backToUsernameButton.addEventListener('click', () => {
    showAuthView('username');
  });
  elements.signOutButton.addEventListener('click', signOut);
  elements.managerModeButton.addEventListener('click', toggleManagerMode);
  elements.managerUnlockForm.addEventListener('submit', unlockManagerMode);
  elements.resetClockInButton.addEventListener('click', resetClockInToday);
  elements.editDurationButton.addEventListener('click', openDurationEditor);
  elements.durationEditor.addEventListener('submit', saveManualDuration);
  elements.exportButton.addEventListener('click', exportCSV);
  elements.cloudToggleButton.addEventListener('click', toggleCloudDetails);
  elements.cloudCreateButton.addEventListener('click', createSyncCode);
  elements.copySyncCodeButton.addEventListener('click', copyCurrentSyncCode);
  elements.cloudConnectButton.addEventListener('click', connectCloud);
  elements.cloudDisconnectButton.addEventListener('click', disconnectCloud);
  elements.cloudSyncButton.addEventListener('click', () => syncCloud());
  elements.languageOptions.forEach((button) => {
    button.addEventListener('click', () => {
      setLanguage(button.dataset.language);
    });
  });
  elements.cloudCodeInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') connectCloud();
  });
  elements.cloudCodeInput.addEventListener('input', renderCloudControls);
  elements.historyList.addEventListener('click', (event) => {
    const button = event.target.closest('.delete-history-btn');
    if (!button) return;
    if (!confirm(t('confirmDelete'))) return;
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

  renderStaticText();
  updateConnectionStatus();
  updateClock();
  renderAuthGate();
  bootCloudSync();
  setupServiceWorker();

  window.setInterval(updateClock, 1000);
})();
