(function () {
  if (document.body?.dataset.page !== "test") {
    return;
  }

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const strategy = {
    title: "Юридические документы за 24 часа в Ярославле и дистанционно по РФ",
    description:
      "Страница продажи быстрых юридических документов: понятная услуга, фиксированная стартовая цена и инструкция по подаче в комплекте.",
    hero: {
      eyebrow: "Быстрые юридические документы",
      title: "Юридические документы за 24 часа в Ярославле и дистанционно по РФ",
      text:
        "Подготовим заявление, иск, претензию, жалобу или возражение под вашу ситуацию. Сначала называем сроки и стоимость, затем готовим документ и даём инструкцию по подаче.",
      points: [
        "Документ за 24 часа",
        "Фиксированная цена от старта",
        "Инструкция по подаче включена",
        "Ответ по заявке за 1–5 минут"
      ]
    },
    benefits: {
      title: "Страница не про «юридические услуги вообще», а про понятный результат под конкретную задачу",
      text:
        "Упаковываем не абстрактную консультацию, а конкретный документ: отмена приказа, иск, возражение, жалоба приставам, претензия, алименты, развод.",
      cards: [
        ["Узкий оффер", "Клиент видит не набор услуг, а нужный ему документ под конкретную проблему."],
        ["Быстрый ответ", "Горячие заявки обрабатываются в течение 1–5 минут без потери спроса."],
        ["Понятная цена", "На старте говорим цену от и уточняем точную стоимость после просмотра документов."],
        ["Дистанционный формат", "Работаем по Ярославлю, области и по РФ, если задача решается удалённо."],
        ["Допродажа дальше", "После документа можно предложить сопровождение, иск, возражение или ведение дела."]
      ]
    },
    servicesTitle: "Какие документы лучше продавать в первую очередь",
    servicesText:
      "Фокус на массовых, срочных и понятных услугах. Это то, что лучше всего конвертируется из Яндекс Директ, Avito и маркетплейсов услуг.",
    services: [
      ["Отмена судебного приказа", "От 2 500 ₽. Срочный документ для отмены приказа банка, МФО, ЖКХ или коллекторов."],
      ["Исковое заявление", "От 5 000 ₽. Подготовка иска по долгам, алиментам, разводу, потребительским спорам и ущербу."],
      ["Возражение на иск", "От 5 000 ₽. Формируем позицию защиты и готовим документ под конкретный спор."],
      ["Жалоба на пристава", "От 3 000 ₽. Если списали деньги, арестовали счета или бездействуют по делу."],
      ["Претензия на возврат денег", "От 2 000 ₽. Для товаров, ремонта, услуг, обучения, туров и других потребительских споров."],
      ["Алименты", "От 4 000 ₽. Подготовка документов на взыскание алиментов и связанные семейные требования."],
      ["Развод без спора", "От 3 000 ₽. Быстрый пакет документов, если задача без сложного раздела имущества."],
      ["Взыскание долга по расписке", "От 7 000 ₽. Документы для возврата денег по расписке и дальнейшего взыскания."],
      ["Договор займа / расписка", "От 2 000 ₽. Профилактический документ, который защищает деньги до спора."],
      ["Апелляционная жалоба", "От 10 000 ₽. Для более сложных кейсов с повышенным чеком и дальнейшим сопровождением."]
    ],
    quickHelp: {
      title: "Получили судебный приказ? Важно не пропустить срок",
      text:
        "Если на руках судебный приказ, постановление пристава или отказ вернуть деньги, пришлите фото документов. Сразу скажем, что можно сделать, сколько это займёт и сколько будет стоить."
    },
    process: {
      title: "Как работает продажа быстрых юридических документов",
      text:
        "Логика простая: получаем задачу, быстро диагностируем ситуацию, фиксируем стоимость, готовим документ и объясняем, куда его подать.",
      steps: [
        ["1. Заявка", "Вы оставляете заявку, звоните или пишете в WhatsApp / Telegram."],
        ["2. Диагностика", "Вы присылаете фото документов, дату получения и кратко описываете ситуацию."],
        ["3. Фиксируем цену", "Мы называем сроки, формат работы и точную стоимость после просмотра документов."],
        ["4. Готовим документ", "Подготавливаем заявление, иск, претензию, жалобу или другой нужный документ."],
        ["5. Даём инструкцию", "Передаём документ и пошагово объясняем, куда и как его подать дальше."]
      ]
    },
    pricing: {
      title: "Продуктовая линейка и стартовые цены",
      text:
        "В рекламе и на лендинге показываем фиксированные стартовые цены. Окончательная стоимость подтверждается после просмотра документов.",
      cards: [
        {
          title: "Экспресс-анализ",
          description: "Снимаем барьер доверия, быстро понимаем задачу и оцениваем срочность.",
          amount: "1 000–2 500 ₽",
          features: [
            "Разбор документов и сроков",
            "Понимание, какой документ нужен",
            "Рекомендация по следующему шагу"
          ],
          button: "Получить экспресс-анализ"
        },
        {
          title: "Подготовка документа",
          description: "Базовая выручка: претензии, жалобы, отмена приказа, иски и возражения.",
          amount: "от 2 000 ₽",
          features: [
            "Готовый документ под вашу ситуацию",
            "Срок от 1 дня",
            "Инструкция по подаче включена"
          ],
          button: "Заказать документ"
        },
        {
          title: "Документ + сопровождение",
          description: "Если после первого документа нужен следующий шаг: иск, возражение, приставы или ведение дела.",
          amount: "от 15 000 ₽",
          features: [
            "Сложные позиции и апелляции",
            "Дальнейшее сопровождение",
            "Рост среднего чека без смены воронки"
          ],
          button: "Обсудить сопровождение"
        }
      ]
    },
    quiz: {
      title: "Быстрый подбор документа",
      text:
        "Мини-квиз по стратегии: 4 вопроса, после которых человеку проще оставить заявку и прислать документы.",
      questions: [
        {
          title: "Какой документ нужен?",
          key: "document",
          options: ["Отмена приказа", "Иск", "Возражение", "Жалоба приставам", "Претензия", "Алименты / развод"]
        },
        {
          title: "Есть ли сроки?",
          key: "deadline",
          options: ["Да, срочно", "Есть срок в ближайшие дни", "Сроков нет, но нужно быстро"]
        },
        {
          title: "Документы уже на руках?",
          key: "documents",
          options: ["Да, есть фото/сканы", "Часть документов есть", "Пока только описываю ситуацию"]
        },
        {
          title: "Куда удобнее получить ответ?",
          key: "channel",
          options: ["WhatsApp", "Telegram", "Звонок", "Форма на сайте"]
        }
      ]
    },
    included: {
      title: "Что входит в подготовку документа",
      text:
        "В стратегии критично продавать не просто файл, а законченный понятный результат, который можно использовать дальше.",
      cards: [
        ["Анализ ситуации", "Смотрим сроки, факты, документы и понимаем, какой именно документ нужен сейчас."],
        ["Подготовка текста", "Делаем документ не по шаблону с форума, а под конкретную ситуацию и задачу клиента."],
        ["Инструкция по подаче", "Объясняем, куда подавать, какие приложения нужны и что делать после отправки."],
        ["Почва для допродажи", "Если после документа нужен следующий шаг, сразу показываем дальнейший маршрут."]
      ]
    },
    reviews: {
      eyebrow: "Отзывы по готовым документам",
      title: "Доверие важнее красивых обещаний",
      text:
        "Для Ярославля и области критичны отзывы, локальное доверие и понятные кейсы. Поэтому блок отзывов остаётся одним из основных доводчиков конверсии.",
      note: "Отзывы с независимых площадок и локальных сервисов"
    },
    faq: [
      ["Можно ли решить задачу дистанционно?", "Да. Для большинства документов достаточно фото или сканов. Мы готовим документ и даём инструкцию по подаче дистанционно."],
      ["Сколько стоит подготовка документа?", "На сайте мы показываем стартовые цены от. Точную стоимость называем после просмотра документов и понимания объёма задачи."],
      ["Что входит в услугу?", "Готовый документ под вашу ситуацию, проверка вводных и инструкция, куда и как его подать."],
      ["За какое время вы готовите документы?", "Простые и срочные документы можем подготовить в течение 24 часов. Более сложные задачи обсуждаются после диагностики."],
      ["Что нужно прислать для старта?", "Фото или сканы документов, дату получения, город суда или органа и краткое описание ситуации."],
      ["Если после документа понадобится следующий шаг?", "Сразу предложим дальнейший маршрут: возражение, иск, жалобу, сопровождение у приставов или ведение дела."]
    ],
    lead: {
      title: "Отправьте документы или опишите задачу",
      text:
        "Лучше всего конвертируются короткие формы, где можно быстро оставить телефон и сразу прислать материалы для оценки. Мы свяжемся с вами в течение 5 минут."
    },
    contacts: {
      title: "Связь для быстрых документов",
      text:
        "Основная задача страницы — перевести человека из рекламы в звонок, WhatsApp или Telegram. Если удобнее, можно приехать в офис или отправить документы дистанционно."
    }
  };

  function setText(selector, value, root = document) {
    const node = $(selector, root);
    if (node && value) {
      node.textContent = value;
    }
  }

  function setHtml(selector, value, root = document) {
    const node = $(selector, root);
    if (node && value) {
      node.innerHTML = value;
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getMessengerLinks() {
    const whatsapp = $("#social-whatsapp")?.getAttribute("href");
    const telegram = $("#social-telegram")?.getAttribute("href");
    const phone = $("#navbar-phone")?.getAttribute("href") || "tel:+74951282424";

    return {
      whatsapp: whatsapp && whatsapp !== "#" ? whatsapp : phone,
      telegram: telegram && telegram !== "#" ? telegram : phone,
      phone
    };
  }

  function ensureAnchorButton(button, href) {
    if (!button) {
      return null;
    }

    const anchor = document.createElement("a");
    anchor.className = button.className;
    anchor.id = button.id;
    anchor.href = href;
    anchor.innerHTML = button.innerHTML;
    button.replaceWith(anchor);
    return anchor;
  }

  function rewriteHero() {
    setText("#hero-eyebrow", strategy.hero.eyebrow);
    setText("#hero-title", strategy.hero.title);
    setText("#hero-text", strategy.hero.text);
    setText("#hero-badge-title", "от 1 дня");
    setText("#hero-badge-text", "фиксированные документы и инструкция");

    const { whatsapp, telegram, phone } = getMessengerLinks();
    const primary = $("#hero-primary-action");
    const secondaryButton = $("#hero-secondary-action");
    const secondary = ensureAnchorButton(secondaryButton, telegram);

    if (primary) {
      primary.textContent = "Написать в WhatsApp";
      primary.href = whatsapp;
      primary.target = "_blank";
      primary.rel = "noreferrer";
    }

    if (secondary) {
      secondary.textContent = "Написать в Telegram";
      secondary.target = "_blank";
      secondary.rel = "noreferrer";
    }

    let points = $(".hero__strategy-points");
    if (!points) {
      points = document.createElement("div");
      points.className = "hero__strategy-points";
      $(".hero__content")?.append(points);
    }
    points.innerHTML = strategy.hero.points.map((item) => `<span>${escapeHtml(item)}</span>`).join("");

    let links = $(".hero__secondary-links");
    if (!links) {
      links = document.createElement("div");
      links.className = "hero__secondary-links";
      points.insertAdjacentElement("afterend", links);
    }
    links.innerHTML = `
      <a href="${escapeHtml(phone)}">Позвонить сейчас</a>
      <a href="#documents">Отправить документы на оценку</a>
      <a href="#quiz">Подобрать документ за 1 минуту</a>
    `;
  }

  function rewriteBenefits() {
    setText(".benefits-strip .section-title .eyebrow", "Маркетинговая упаковка оффера");
    setText(".benefits-strip .section-title h2", strategy.benefits.title);
    setText(".benefits-strip .section-title p", strategy.benefits.text);

    $$(".benefits-strip .mini-card").forEach((card, index) => {
      const content = strategy.benefits.cards[index];
      if (!content) {
        return;
      }
      setText("h3", content[0], card);
      setText("p", content[1], card);
    });
  }

  function rewriteServices() {
    setText("#services .section-title .eyebrow", "Приоритетные документы");
    setText("#services .section-title h2", strategy.servicesTitle);
    setText("#services .section-title p", strategy.servicesText);

    $$(".service-card").forEach((card, index) => {
      const content = strategy.services[index];
      if (!content) {
        return;
      }
      card.dataset.service = content[0];
      const title = $("h3", card);
      const desc = $("p", card);
      if (title) {
        title.textContent = content[0];
      }
      if (desc) {
        const [price, text] = content[1].split(". ");
        desc.innerHTML = `<span class="service-card__price">${escapeHtml(price)}</span>${escapeHtml(text || content[1])}`;
      }
    });
  }

  function insertQuizSection() {
    if ($("#quiz")) {
      return;
    }

    const servicesSection = $("#services");
    if (!servicesSection) {
      return;
    }

    const section = document.createElement("section");
    section.className = "section-full strategy-quiz";
    section.id = "quiz";
    section.innerHTML = `
      <div class="page-shell">
        <div class="section-title reveal">
          <span class="eyebrow">Квиз из 4 вопросов</span>
          <h2>${escapeHtml(strategy.quiz.title)}</h2>
          <p>${escapeHtml(strategy.quiz.text)}</p>
        </div>
        <div class="strategy-quiz__grid">
          ${strategy.quiz.questions
            .map(
              (question) => `
                <article class="strategy-quiz__card" data-quiz-question="${escapeHtml(question.key)}">
                  <h3>${escapeHtml(question.title)}</h3>
                  <div class="strategy-quiz__options">
                    ${question.options
                      .map(
                        (option) =>
                          `<button class="strategy-quiz__option" type="button" data-quiz-value="${escapeHtml(option)}">${escapeHtml(option)}</button>`
                      )
                      .join("")}
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
        <div class="strategy-quiz__footer">
          <h3>Подберём нужный документ и скажем стоимость</h3>
          <p>По стратегии здесь должен быть фильтр, который сразу повышает качество заявки: какой документ нужен, срочно ли, есть ли документы и куда удобнее получить ответ.</p>
          <div class="strategy-quiz__summary" id="quiz-summary"></div>
          <a class="btn btn--secondary btn--lg" href="#lead" id="quiz-cta">Получить ответ за 5 минут</a>
        </div>
      </div>
    `;

    servicesSection.insertAdjacentElement("afterend", section);
    bindQuizSection();
  }

  function bindQuizSection() {
    const answers = {};
    const summary = $("#quiz-summary");
    const leadMessage = $('.lead-form textarea[name="message"]');
    const selectedService = $("#selected-service");

    $$(".strategy-quiz__option").forEach((button) => {
      button.addEventListener("click", () => {
        const group = button.closest("[data-quiz-question]");
        const key = group?.dataset.quizQuestion;
        if (!key) {
          return;
        }

        $$(".strategy-quiz__option", group).forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        answers[key] = button.dataset.quizValue || "";

        if (summary) {
          summary.innerHTML = Object.values(answers)
            .filter(Boolean)
            .map((value) => `<span>${escapeHtml(value)}</span>`)
            .join("");
        }

        if (selectedService && answers.document) {
          selectedService.value = answers.document;
        }

        if (leadMessage) {
          leadMessage.value = [
            answers.document ? `Нужный документ: ${answers.document}` : "",
            answers.deadline ? `Сроки: ${answers.deadline}` : "",
            answers.documents ? `Документы на руках: ${answers.documents}` : "",
            answers.channel ? `Удобный канал связи: ${answers.channel}` : ""
          ]
            .filter(Boolean)
            .join("\n");
        }
      });
    });
  }

  function rewriteQuickHelp() {
    setText("#quick-help .eyebrow", "Срочный срок по документу");
    setText("#quick-help h2", strategy.quickHelp.title);
    setText("#quick-help p", strategy.quickHelp.text);
    const button = $("#quick-help .btn");
    if (button) {
      button.textContent = "Получить быстрый ответ";
    }
  }

  function rewriteOffice() {
    setText("#office-eyebrow", "Офис и дистанционный формат");
    setText("#office-title", "Можно приехать в офис или решить вопрос удалённо");
    setText(
      "#office-text",
      "По стратегии офис остаётся точкой доверия, но основной сценарий продаж строится вокруг быстрой отправки документов, диагностики и понятного ответа по срокам и цене."
    );

    const button = $("#office-button");
    if (button) {
      button.textContent = "Выбрать формат консультации";
    }
  }

  function rewriteProcess() {
    setText("#process .section-title .eyebrow", "Понятная воронка");
    setText("#process .section-title h2", strategy.process.title);
    setText("#process .section-title p", strategy.process.text);

    $$(".process-step").forEach((step, index) => {
      const data = strategy.process.steps[index];
      if (!data) {
        return;
      }
      setText(".process-step__index", data[0], step);
      setText("p", data[1], step);
    });
  }

  function insertIncludedSection() {
    if ($("#included")) {
      return;
    }

    const processSection = $("#process");
    if (!processSection) {
      return;
    }

    const section = document.createElement("section");
    section.className = "section-full strategy-included";
    section.id = "included";
    section.innerHTML = `
      <div class="page-shell">
        <div class="section-title reveal">
          <span class="eyebrow">Что входит в услугу</span>
          <h2>${escapeHtml(strategy.included.title)}</h2>
          <p>${escapeHtml(strategy.included.text)}</p>
        </div>
        <div class="strategy-included__grid reveal-group">
          ${strategy.included.cards
            .map(
              (card, index) => `
                <article class="strategy-included__card">
                  <div class="strategy-included__icon">${["⌁", "▣", "→", "◌"][index] || "•"}</div>
                  <h3>${escapeHtml(card[0])}</h3>
                  <p>${escapeHtml(card[1])}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </div>
    `;

    processSection.insertAdjacentElement("afterend", section);
  }

  function rewritePricing() {
    setText("#prices .section-title .eyebrow", "Продуктовая линейка");
    setText("#prices .section-title h2", strategy.pricing.title);
    setText("#prices .section-title p", strategy.pricing.text);

    strategy.pricing.cards.forEach((card, index) => {
      setText(`[data-price-title="${index}"]`, card.title);
      setText(`[data-price-description="${index}"]`, card.description);
      setText(`[data-price-amount="${index}"]`, card.amount);
      const list = $(`[data-price-features="${index}"]`);
      if (list) {
        list.innerHTML = card.features.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
      }
      const button = $(`[data-price-button="${index}"]`);
      if (button) {
        button.textContent = card.button;
      }
    });

    const popular = $('[data-price-popular="1"]');
    if (popular) {
      popular.textContent = "Рекомендуем для старта";
      popular.hidden = false;
    }
  }

  function rewriteDocuments() {
    setText("#documents .section-title .eyebrow", "Диагностика перед работой");
    setText("#documents-title", "Пришлите фото документов — скажем срок и точную стоимость");
    setText(
      "#documents-description",
      "По стратегии это ключевая точка конверсии. Клиенту проще прислать документы и сразу получить цену, срок и понятный следующий шаг."
    );
    setText(
      "#documents-upload-hint",
      "Подойдут PDF, DOCX, JPG, PNG. Пришлите то, что получили из суда, от приставов, от продавца, банка или другой стороны."
    );
    setText("#documents-submit-label", "Отправить документы на оценку");
  }

  function rewriteReviews() {
    setText("#reviews-eyebrow", strategy.reviews.eyebrow);
    setText("#reviews-title", strategy.reviews.title);
    setText("#reviews-text", strategy.reviews.text);
    setText("#reviews-trust-note", strategy.reviews.note);
    const cta = $("#reviews-cta");
    if (cta) {
      cta.textContent = "Получить консультацию";
    }
  }

  function rewriteSocials() {
    setText("#social-hub .section-title .eyebrow", "Мессенджеры и быстрый контакт");
    setText("#social-hub .section-title h2", "Переводим человека из рекламы в удобный канал связи");
    setText(
      "#social-hub .section-title p",
      "Для такой стратегии важны быстрые обращения: WhatsApp, Telegram, звонок и локальные площадки, где можно быстро уточнить задачу."
    );
  }

  function rewriteFaq() {
    const items = $$(".faq-item");
    strategy.faq.forEach((pair, index) => {
      const item = items[index];
      if (!item) {
        return;
      }
      setText("button", pair[0], item);
      setText("p", pair[1], item);
    });
  }

  function rewriteLead() {
    setText(".lead-form h2", strategy.lead.title);
    setText(".lead-form p", strategy.lead.text);
    const nameInput = $('.lead-form input[name="name"]');
    const phoneInput = $('.lead-form input[name="phone"]');
    const messageInput = $('.lead-form textarea[name="message"]');

    if (nameInput) {
      nameInput.placeholder = "Ваше имя";
    }

    if (phoneInput) {
      phoneInput.placeholder = "Телефон";
    }

    if (messageInput) {
      messageInput.placeholder = "Какая задача, какие документы уже есть и насколько срочно нужен результат";
    }

    const button = $('.lead-form button[type="submit"]');
    if (button) {
      button.textContent = "Получить цену и срок";
    }
  }

  function rewriteContacts() {
    setText(".contacts-intro .eyebrow", "Связь и отправка документов");
    setText(".contacts-intro h2", "Как с нами связаться");
    setText(".contacts-intro p", strategy.contacts.text);

    const actionButtons = $$(".contact-action-card .btn");
    if (actionButtons[0]) {
      actionButtons[0].textContent = "Отправить документы";
    }
    if (actionButtons[1]) {
      actionButtons[1].textContent = "Получить звонок за 5 минут";
    }
  }

  function setMeta() {
    document.title = strategy.title;
    const description = $('meta[name="description"]');
    if (description) {
      description.setAttribute("content", strategy.description);
    }
  }

  function applyStrategy() {
    setMeta();
    rewriteHero();
    rewriteBenefits();
    rewriteServices();
    insertQuizSection();
    rewriteQuickHelp();
    rewriteOffice();
    rewriteProcess();
    insertIncludedSection();
    rewritePricing();
    rewriteDocuments();
    rewriteReviews();
    rewriteSocials();
    rewriteFaq();
    rewriteLead();
    rewriteContacts();
  }

  window.addEventListener("load", () => {
    applyStrategy();
    window.setTimeout(applyStrategy, 300);
    window.setTimeout(applyStrategy, 1200);
  });
})();
