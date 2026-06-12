module.exports = {
  branding: {
    siteTitle: "Правовой партнёр",
    siteDescription:
      "Юридические услуги для частных клиентов, предпринимателей и компаний. Разбор ситуации, документы, переговоры, суды, офис и онлайн.",
    logoHeaderPath: "/assets/logo.png",
    logoFooterPath: "/assets/logo.png",
    faviconPath: "/assets/logo.png",
    heroImagePath: "/assets/hero-placeholder.svg",
    contactImagePath: "/assets/contact-art.svg",
    documentArtPath: "/assets/document-art.svg",
    quickHelpIconPath: "/assets/quick-help-icon.svg"
  },
  contacts: {
    cityAddress: "Москва, ул. Тверская, 16, офис 812",
    phoneDisplay: "+7 (495) 128-24-24",
    phoneHref: "+74951282424",
    email: "info@prav-partner.ru",
    workingHours: "Пн–Пт 9:00–19:00 · Сб 10:00–16:00",
    footerDescription: "Юридические решения для жизни и бизнеса.",
    telegramUrl: "#",
    telegramIconPath: "/assets/socials/telegram.svg",
    whatsappUrl: "#",
    whatsappIconPath: "/assets/socials/whatsapp.svg",
    vkUrl: "#",
    vkIconPath: "/assets/socials/vk.svg",
    maxUrl: "#",
    maxIconPath: "/assets/socials/max.png"
  },
  hero: {
    eyebrow: "Юридические услуги для людей и бизнеса",
    title: "Быстрый юридический разбор вашей ситуации",
    text:
      "Проанализируем вашу ситуацию, объясним риски и предложим понятный план действий. Работаем онлайн и принимаем клиентов в офисе.",
    primaryButtonLabel: "Получить разбор",
    primaryButtonType: "anchor",
    primaryButtonValue: "#lead",
    secondaryButtonLabel: "Записаться в офис",
    secondaryButtonType: "modal",
    secondaryButtonValue: "appointment",
    badgeTitle: "до 24 ч.",
    badgeText: "на первичный разбор"
  },
  services: [
    { title: "Для граждан", imagePath: "" },
    { title: "Недвижимость", imagePath: "" },
    { title: "Бизнесу", imagePath: "" },
    { title: "Налоги и финансы", imagePath: "" },
    { title: "Трудовые споры", imagePath: "" },
    { title: "Арбитраж и суды", imagePath: "" },
    { title: "Интеллектуальная собственность", imagePath: "" },
    { title: "Банкротство", imagePath: "" },
    { title: "Миграционные вопросы", imagePath: "" },
    { title: "Другие услуги", imagePath: "" }
  ],
  actions: {
    urgentButtonLabel: "Помощь за 5 минут",
    urgentButtonType: "modal",
    urgentButtonValue: "callback",
    navbarButtonLabel: "Записаться в офис",
    navbarButtonType: "modal",
    navbarButtonValue: "appointment",
    officeButtonLabel: "Записаться в офис",
    officeButtonType: "modal",
    officeButtonValue: "appointment"
  },
  prices: [
    {
      title: "Базовый",
      description: "Краткий разбор по телефону или в мессенджере",
      price: "0 ₽",
      features: [
        "Ответим на ваш вопрос",
        "Оценим перспективы",
        "Подскажем первые шаги"
      ],
      buttonLabel: "Получить бесплатно",
      buttonType: "anchor",
      buttonValue: "#lead",
      featured: false
    },
    {
      title: "Оптимальный",
      description: "Подробный разбор и план действий",
      price: "3 900 ₽",
      features: [
        "Анализ ситуации и документов",
        "Оценка рисков",
        "План действий и рекомендации"
      ],
      buttonLabel: "Заказать разбор",
      buttonType: "anchor",
      buttonValue: "#lead",
      featured: true
    },
    {
      title: "Расширенный",
      description: "Глубокий анализ и стратегия",
      price: "7 900 ₽",
      features: [
        "Комплексный анализ",
        "Варианты решения и стратегия",
        "Консультация юриста 60 минут"
      ],
      buttonLabel: "Заказать разбор",
      buttonType: "anchor",
      buttonValue: "#lead",
      featured: false
    }
  ],
  documents: {
    title: "Загрузите документы — мы посмотрим и подскажем первый шаг",
    description:
      "Подойдут PDF, DOCX, JPG, PNG. Документы нужны только для предварительной оценки ситуации.",
    uploadHint: "До 10 файлов, общий размер до 50 МБ",
    buttonLabel: "Отправить документы на проверку",
    allowedExtensions: "pdf,doc,docx,jpg,jpeg,png",
    maxFiles: 10,
    maxTotalSizeMb: 50,
    uploadDirectory: "documents",
    successMessage: "Документы загружены. Мы свяжемся с вами после проверки.",
    webhookUrl: ""
  },
  office: {
    eyebrow: "Можно приехать лично",
    title: "Офис в центре города",
    text:
      "Встретимся по предварительной записи, изучим документы и обсудим варианты решения без спешки.",
    points: [
      "Москва, ул. Тверская, 16, офис 812",
      "Пн–Пт 9:00–19:00, Сб 10:00–16:00",
      "Онлайн-консультации доступны по всей России"
    ],
    mapTitle: "Тверская, 16",
    mapSubtitle: "офис 812",
    mapEmbedUrl:
      "https://yandex.ru/map-widget/v1/?ll=39.869363%2C57.630114&mode=search&oid=1787836671&ol=biz&z=19.97"
  },
  reviews: {
    eyebrow: "Отзывы клиентов",
    title: "Нам доверяют клиенты",
    text: "Реальные отзывы о нашей работе на независимых площадках.",
    summaryScore: "4.9",
    summaryScaleText: "из 5",
    reviewCount: "248",
    reviewCountPrefix: "на основе",
    reviewCountSuffix: "отзывов",
    trustNote: "Отзывы с независимых площадок",
    ctaLabel: "Получить консультацию",
    ctaType: "anchor",
    ctaValue: "#lead",
    backgroundImagePath: "",
    columnImagePath: "",
    laurelLeftPath: "",
    laurelRightPath: "",
    platforms: [
      { id: "yandex", name: "Яндекс Карты", logoPath: "" },
      { id: "google", name: "Google", logoPath: "" },
      { id: "2gis", name: "2GIS", logoPath: "" },
      { id: "youdo", name: "YouDo", logoPath: "" },
      { id: "profi", name: "Профи.ру", logoPath: "" },
      { id: "avito", name: "Авито", logoPath: "" }
    ],
    items: [
      { platformId: "yandex", date: "1 июня 2024", rating: "5.0", imagePath: "" },
      { platformId: "google", date: "28 апреля 2024", rating: "5.0", imagePath: "" },
      { platformId: "2gis", date: "15 мая 2024", rating: "5.0", imagePath: "" }
    ]
  },
  analytics: {
    yandexMetrikaId: "",
    googleTagManagerId: ""
  },
  crm: {
    bitrixWebhookUrl: "",
    leadWebhookUrl: "",
    callbackWebhookUrl: "",
    appointmentWebhookUrl: "",
    documentWebhookUrl: ""
  }
};
