(function () {
  if (document.body?.dataset.page !== "test") {
    return;
  }

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  let strategyRevealObserver = null;

  const strategy = {
    title: "Юридические документы за 24 часа в Ярославле и дистанционно по РФ",
    description:
      "Подготовка юридических документов под вашу ситуацию: заявление, иск, претензия, возражение, жалоба. Сначала называем срок и стоимость, затем готовим документ и даём инструкцию по подаче.",
    hero: {
      eyebrow: "Быстрые юридические документы",
      title: "Юридические документы за 24 часа в Ярославле и дистанционно по РФ",
      text:
        "Подготовим заявление, иск, претензию, жалобу или возражение под вашу ситуацию. Сначала скажем сроки и стоимость, затем подготовим документ и объясним, как его подать.",
      points: [
        "Документ за 24 часа",
        "Фиксированная цена от старта",
        "Инструкция по подаче включена",
        "Ответ по заявке за 1–5 минут"
      ]
    },
    benefits: {
      title: "Помогаем быстро разобраться в ситуации и подготовить нужный документ",
      text:
        "Если вам нужен иск, претензия, возражение, жалоба или заявление, сразу скажем, что можно сделать, сколько это займёт и сколько будет стоить.",
      cards: [
        ["Под вашу задачу", "Готовим документ именно под вашу ситуацию, а не даём общие рекомендации."],
        ["Ответ за 1–5 минут", "Быстро выходим на связь, уточняем детали и называем следующий шаг."],
        ["Понятная стоимость", "Сначала озвучиваем цену и срок, после согласования приступаем к работе."],
        ["Можно дистанционно", "Работаем по Ярославлю и области, документы принимаем онлайн по всей России."],
        ["Подскажем, что дальше", "Если после документа понадобится следующий шаг, объясним, как действовать дальше."]
      ]
    },
    servicesTitle: "Какие документы мы можем подготовить",
    servicesText:
      "Выберите нужное направление. По каждому обращению сначала уточняем срок, стоимость и удобный формат работы.",
    services: [
      ["Отмена судебного приказа", "От 2 500 ₽. Подготовим документ для отмены судебного приказа банка, МФО, ЖКХ или коллекторов."],
      ["Исковое заявление", "От 5 000 ₽. Подготовка иска по долгам, алиментам, разводу, потребительским спорам и возмещению ущерба."],
      ["Возражение на иск", "От 5 000 ₽. Подготовим позицию защиты и составим возражение под вашу конкретную ситуацию."],
      ["Жалоба на пристава", "От 3 000 ₽. Если списали деньги, арестовали счета или бездействуют по вашему делу."],
      ["Претензия на возврат денег", "От 2 000 ₽. Для товаров, ремонта, услуг, обучения, туров и других потребительских споров."],
      ["Алименты", "От 4 000 ₽. Подготовим документы на взыскание алиментов и связанные семейные требования."],
      ["Развод без спора", "От 3 000 ₽. Быстрый комплект документов, если дело не осложнено спором об имуществе."],
      ["Взыскание долга по расписке", "От 7 000 ₽. Подготовим документы для возврата денег и дальнейшего взыскания."],
      ["Договор займа / расписка", "От 2 000 ₽. Подготовим документ, который заранее защищает ваши интересы."],
      ["Апелляционная жалоба", "От 10 000 ₽. Для более сложных дел, где важно оспорить решение и выстроить сильную позицию."]
    ],
    quickHelp: {
      title: "Получили судебный приказ? Важно не пропустить срок",
      text:
        "Если у вас на руках судебный приказ, постановление пристава или отказ вернуть деньги, пришлите фото документов. Сразу скажем, что можно сделать, сколько это займёт и сколько будет стоить."
    },
    process: {
      title: "Как проходит работа",
      text:
        "Вам не нужно заранее разбираться в юридических деталях. Мы быстро получаем вводные, оцениваем ситуацию и готовим понятный документ под вашу задачу.",
      steps: [
        ["1. Заявка", "Вы оставляете заявку, звоните или пишете в WhatsApp / Telegram."],
        ["2. Диагностика", "Вы присылаете фото документов, дату получения и кратко описываете ситуацию."],
        ["3. Согласование", "Мы называем сроки, формат работы и точную стоимость после просмотра документов."],
        ["4. Подготовка", "Готовим заявление, иск, претензию, жалобу, возражение или другой нужный документ."],
        ["5. Подача", "Передаём документ и объясняем, куда и как его подать дальше."]
      ]
    },
    pricing: {
      title: "Стоимость и форматы работы",
      text:
        "Для типовых задач фиксируем стоимость до начала работы. Если ситуация требует нестандартной подготовки, скажем об этом до оплаты.",
      cards: [
        {
          title: "Экспресс-анализ",
          description: "Короткий разбор документов и ситуации, если нужно быстро понять порядок действий.",
          amount: "2 500 ₽",
          features: [
            "Разбор документов и сроков",
            "Понимание, какой документ нужен",
            "Рекомендация по следующему шагу"
          ],
          button: "Получить экспресс-анализ"
        },
        {
          title: "Подготовка документа",
          description: "Подготовим претензию, жалобу, заявление, иск или возражение под вашу конкретную задачу.",
          amount: "6 000 ₽",
          features: [
            "Готовый документ под вашу ситуацию",
            "Срок от 1 дня",
            "Инструкция по подаче включена"
          ],
          button: "Заказать документ"
        },
        {
          title: "Сложный документ или позиция по делу",
          description: "Если задача требует более глубокой проработки, сложной позиции или подготовки апелляции.",
          amount: "15 000 ₽",
          features: [
            "Сложные позиции и апелляции",
            "Дальнейшее сопровождение",
            "Помощь на следующем этапе дела"
          ],
          button: "Обсудить сопровождение"
        }
      ]
    },
    quiz: {
      title: "Быстрый подбор документа",
      text:
        "Ответьте на 4 коротких вопроса, и мы быстрее поймём вашу задачу, срок и удобный формат связи.",
      questions: [
        {
          title: "Какой документ нужен?",
          key: "document",
          options: ["Отмена приказа", "Иск", "Возражение", "Жалоба приставам", "Претензия", "Алименты / развод"]
        },
        {
          title: "Есть ли сроки?",
          key: "deadline",
          options: ["Да, срочно", "Есть срок в ближайшие дни", "Сроков нет, но нужно быстрее"]
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
        "Вы получаете не просто шаблон, а готовый документ под вашу ситуацию и понятный порядок дальнейших действий.",
      cards: [
        ["Анализ ситуации", "Смотрим сроки, факты и документы, чтобы понять, какой именно документ нужен сейчас."],
        ["Подготовка текста", "Готовим документ под вашу задачу, а не используем универсальный шаблон."],
        ["Инструкция по подаче", "Объясняем, куда подавать документ, какие нужны приложения и что делать дальше."],
        ["Дальнейшие шаги", "Если после документа нужен следующий юридический шаг, подскажем, как действовать дальше."]
      ]
    },
    examples: {
      title: "С какими задачами к нам обращаются чаще всего",
      text:
        "Ниже типовые ситуации, по которым мы чаще всего готовим документы. Все примеры обезличены и приведены для понимания формата работы.",
      cards: [
        ["Отмена судебного приказа", "Клиент получил судебный приказ и не успевал разобраться в сроках. Подготовили заявление на отмену и инструкцию по подаче."],
        ["Возврат денег по претензии", "Покупателю отказались возвращать деньги за услугу. Подготовили претензию и порядок дальнейших действий."],
        ["Алименты и семейный спор", "Нужно было быстро подготовить документы на алименты и понять следующий шаг по делу."],
        ["Взыскание долга по расписке", "Клиенту нужно было вернуть деньги по расписке и запустить процесс взыскания без потери времени."]
      ]
    },
    reviews: {
      eyebrow: "Отзывы клиентов",
      title: "Нам доверяют клиенты в Ярославле и по России",
      text:
        "Показываем реальные отзывы о нашей работе на независимых площадках. Это помогает заранее понять уровень сервиса и качество нашей работы.",
      note: "Отзывы с независимых площадок и локальных сервисов"
    },
    faq: [
      ["Можно ли решить задачу дистанционно?", "Да. Для большинства документов достаточно фото или сканов. Мы готовим документ и даём инструкцию по подаче дистанционно."],
      ["Сколько стоит подготовка документа?", "На сайте указаны стартовые цены. Точную стоимость называем после просмотра документов и понимания объёма задачи."],
      ["Что входит в услугу?", "Готовый документ под вашу ситуацию, проверка вводных и понятная инструкция, куда и как его подать."],
      ["За какое время вы готовите документы?", "Простые и срочные документы можем подготовить в течение 24 часов. Более сложные задачи обсуждаются после диагностики."],
      ["Что нужно прислать для старта?", "Фото или сканы документов, дату получения, город суда или органа и краткое описание ситуации."],
      ["Если после документа понадобится следующий шаг?", "Подскажем дальнейший порядок действий: возражение, иск, жалоба, работа с приставами или сопровождение дела."]
    ],
    lead: {
      title: "Отправьте документы или опишите задачу",
      text:
        "Оставьте телефон или отправьте документы на оценку. Мы свяжемся с вами, уточним задачу и скажем, какой документ нужен, сколько времени займёт подготовка и какая будет стоимость."
    },
    contacts: {
      text:
        "Выберите удобный способ связи: звонок, мессенджер или встреча в офисе. Если документы уже на руках, их можно сразу отправить на предварительную оценку."
    }
  };

  function setText(selector, value, root = document) {
    const node = $(selector, root);
    if (node && value) {
      node.textContent = value;
    }
  }

  function showElement(selector, root = document) {
    const node = $(selector, root);
    if (!node) {
      return null;
    }
    node.hidden = false;
    node.removeAttribute("hidden");
    return node;
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

  function animateStrategyItem(element) {
    if (!element) {
      return;
    }

    element.style.opacity = "1";
    element.style.transform = "translateY(0)";

    if (typeof element.animate === "function") {
      element.animate(
        [
          { opacity: 0, transform: "translateY(24px)" },
          { opacity: 1, transform: "translateY(0)" }
        ],
        {
          duration: 720,
          easing: "cubic-bezier(.2,.8,.2,1)",
          fill: "forwards"
        }
      );
    }
  }

  function bindStrategyRevealObserver() {
    if (strategyRevealObserver || window.gsap || !("IntersectionObserver" in window)) {
      return;
    }

    strategyRevealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          if (entry.target.classList.contains("reveal")) {
            animateStrategyItem(entry.target);
          } else if (entry.target.classList.contains("reveal-group")) {
            $$(":scope > *", entry.target).forEach((item, index) => {
              window.setTimeout(() => {
                animateStrategyItem(item);
              }, index * 120);
            });
          }

          strategyRevealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );
  }

  function refreshStrategyReveals() {
    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);

      $$(".strategy-quiz .reveal, .strategy-included .reveal, .strategy-examples .reveal").forEach((element) => {
        if (element.dataset.strategyRevealBound) {
          return;
        }

        element.dataset.strategyRevealBound = "true";
        window.gsap.set(element, { opacity: 0, y: 24 });
        window.gsap.to(element, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%"
          }
        });
      });

      $$(".strategy-quiz .reveal-group, .strategy-included .reveal-group, .strategy-examples .reveal-group").forEach((group) => {
        if (group.dataset.strategyRevealBound) {
          return;
        }

        group.dataset.strategyRevealBound = "true";
        window.gsap.set($$(":scope > *", group), { opacity: 0, y: 24 });
        window.gsap.to($$(":scope > *", group), {
          opacity: 1,
          y: 0,
          duration: 0.72,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: group,
            start: "top 84%"
          }
        });
      });

      if (window.ScrollTrigger?.refresh) {
        window.ScrollTrigger.refresh();
      }

      return;
    }

    bindStrategyRevealObserver();

    $$(".strategy-quiz .reveal, .strategy-included .reveal, .strategy-examples .reveal").forEach((element) => {
      if (element.dataset.strategyRevealBound) {
        return;
      }

      element.dataset.strategyRevealBound = "true";
      const inView = element.getBoundingClientRect().top <= window.innerHeight * 0.9;
      if (inView || !strategyRevealObserver) {
        animateStrategyItem(element);
        return;
      }
      strategyRevealObserver.observe(element);
    });

    $$(".strategy-quiz .reveal-group, .strategy-included .reveal-group, .strategy-examples .reveal-group").forEach((group) => {
      if (group.dataset.strategyRevealBound) {
        return;
      }

      group.dataset.strategyRevealBound = "true";
      const inView = group.getBoundingClientRect().top <= window.innerHeight * 0.9;
      if (inView || !strategyRevealObserver) {
        $$(":scope > *", group).forEach((item, index) => {
          window.setTimeout(() => {
            animateStrategyItem(item);
          }, index * 120);
        });
        return;
      }
      strategyRevealObserver.observe(group);
    });
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
    setText(".benefits-strip .section-title .eyebrow", "Почему к нам обращаются");
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
    setText("#services .section-title .eyebrow", "Основные услуги");
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
          <span class="eyebrow">Короткий опрос</span>
          <h2>Ответьте на 4 вопроса, чтобы мы быстрее оценили вашу задачу</h2>
          <p>${escapeHtml(strategy.quiz.text)}</p>
        </div>
        <div class="strategy-quiz__grid reveal-group">
          ${strategy.quiz.questions
            .map(
              (question, index) => `
                <article class="strategy-quiz__card" data-quiz-question="${escapeHtml(question.key)}">
                  <span class="strategy-quiz__eyebrow">Вопрос ${index + 1}</span>
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
        <div class="strategy-quiz__footer reveal">
          <h3>Подберём нужный документ и скажем стоимость</h3>
          <p>Это ускорит первичный разбор: мы сразу поймём, какой документ нужен, насколько срочная задача и в каком формате вам удобнее получить ответ.</p>
          <div class="strategy-quiz__summary" id="quiz-summary"></div>
          <a class="btn btn--secondary btn--lg" href="#lead" id="quiz-cta">Получить ответ за 5 минут</a>
        </div>
      </div>
    `;

    servicesSection.insertAdjacentElement("afterend", section);
    bindQuizSection();
    refreshStrategyReveals();
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
    setText("#quick-help .eyebrow", "Срочная помощь");
    setText("#quick-help h2", strategy.quickHelp.title);
    setText("#quick-help p", strategy.quickHelp.text);
    const button = $("#quick-help .btn");
    if (button) {
      button.textContent = "Получить быстрый ответ";
    }
  }

  function rewriteOffice() {
    setText("#office-eyebrow", "Офис в Ярославле и онлайн");
    setText("#office-title", "Можно приехать в офис или решить вопрос дистанционно");
    setText(
      "#office-text",
      "Если удобнее, обсудим задачу лично в офисе в Ярославле. Если нужен быстрый старт, отправьте документы онлайн и получите ответ дистанционно."
    );

    const button = $("#office-button");
    if (button) {
      button.textContent = "Выбрать формат консультации";
    }
  }

  function rewriteProcess() {
    setText("#process .section-title .eyebrow", "Как мы работаем");
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
          <span class="eyebrow">Что входит в работу</span>
          <h2>${escapeHtml(strategy.included.title)}</h2>
          <p>${escapeHtml(strategy.included.text)}</p>
        </div>
        <div class="strategy-included__grid reveal-group">
          ${strategy.included.cards
            .map(
              (card, index) => `
                <article class="strategy-included__card">
                  <div class="strategy-included__icon">${["⌃", "▣", "→", "◌"][index] || "•"}</div>
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
    refreshStrategyReveals();
  }

  function insertExamplesSection() {
    if ($("#examples")) {
      return;
    }

    const reviewsSection = $("#reviews");
    if (!reviewsSection) {
      return;
    }

    const section = document.createElement("section");
    section.className = "section-full strategy-examples";
    section.id = "examples";
    section.innerHTML = `
      <div class="page-shell">
        <div class="section-title reveal">
          <span class="eyebrow">Примеры ситуаций</span>
          <h2>${escapeHtml(strategy.examples.title)}</h2>
          <p>${escapeHtml(strategy.examples.text)}</p>
        </div>
        <div class="strategy-examples__grid reveal-group">
          ${strategy.examples.cards
            .map(
              (card) => `
                <article class="strategy-examples__card">
                  <span class="strategy-examples__badge">Обезличенный пример</span>
                  <h3>${escapeHtml(card[0])}</h3>
                  <p>${escapeHtml(card[1])}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </div>
    `;

    reviewsSection.insertAdjacentElement("afterend", section);
    refreshStrategyReveals();
  }

  function rewritePricing() {
    setText("#prices .section-title .eyebrow", "Стоимость услуг");
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
    setText("#documents .section-title .eyebrow", "Отправьте документы");
    setText("#documents-title", "Пришлите фото документов — скажем срок и точную стоимость");
    const description = showElement("#documents-description");
    if (description) {
      description.textContent =
        "Пришлите фото или сканы документов. Мы посмотрим материалы, скажем срок подготовки и назовём точную стоимость до начала работы.";
    }
    setText(
      "#documents-upload-hint",
      "Подойдут PDF, DOCX, JPG, PNG. Пришлите то, что получили из суда, от приставов, от банка, продавца или другой стороны."
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
    setText("#social-hub .section-title .eyebrow", "На связи");
    setText("#social-hub .section-title h2", "Свяжитесь с нами удобным способом");
    setText(
      "#social-hub .section-title p",
      "Если удобнее обсудить задачу в мессенджере, напишите нам. Быстро ответим, уточним детали и подскажем следующий шаг."
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
    setText(".contacts-intro .eyebrow", "Контакты");
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
    insertExamplesSection();
    rewriteSocials();
    rewriteFaq();
    rewriteLead();
    rewriteContacts();
    refreshStrategyReveals();
  }

  window.addEventListener("load", () => {
    applyStrategy();
    window.setTimeout(applyStrategy, 300);
    window.setTimeout(applyStrategy, 1200);
  });
})();
