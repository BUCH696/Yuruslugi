module.exports = {
  branding: {
    siteTitle: "Правовой партнёр",
    siteDescription:
      "Юридические услуги для частных клиентов, предпринимателей и компаний. Разбор ситуации, документы, переговоры, суды, офис и онлайн.",
    logoHeaderPath: "/assets/logo.svg",
    logoFooterPath: "/assets/logo-light.svg",
    heroImagePath: "/assets/hero-placeholder.svg",
    contactImagePath: "/assets/contact-art.svg"
  },
  contacts: {
    cityAddress: "Москва, ул. Тверская, 16, офис 812",
    phoneDisplay: "+7 (495) 128-24-24",
    phoneHref: "+74951282424",
    email: "info@prav-partner.ru",
    workingHours: "Пн–Пт 9:00–19:00 · Сб 10:00–16:00",
    footerDescription: "Юридические решения для жизни и бизнеса.",
    telegramUrl: "#",
    whatsappUrl: "#",
    vkUrl: "#"
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
    mapEmbedUrl: ""
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
