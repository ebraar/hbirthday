import { useEffect, useRef, useState } from "react";
import "./App.css";

const memories = [
  {
    id: 1,
    title: "İlk Buluşmamız",
    icon: "🌿",
    image: "/images/ilk-bulusma.jpeg",
    text: [
      "İkimiz de o kadar heyecanlı ve gergindik ki...",
      "Belki bunu o gün birbirimize söylemedik ama ben sana tam da o gün gerçekten âşık oldum.",
      "Kalbimin seni seçtiği ilk gün. 🤍",
    ],
  },
  {
    id: 2,
    title: "Bir Saate Koca Bir Mutluluk Sığdırdık",
    icon: "☕",
    image: "/images/ikinci-bulusma.jpeg",
    text: [
      "Sivas’a gitmeden önce birbirimizi bir kez daha görmeye ihtiyacımız vardı.",
      "Sadece bir saatti ama o bir saate kocaman bir mutluluk sığdırdık.",
      "Eve dönerken tek düşündüğüm şey, keşke biraz daha kalsaydık oldu. 🤍",
    ],
  },
  {
    id: 3,
    title: "Yeniden Kavuştuğumuz Gün",
    icon: "🌹",
    image: "/images/kavusma.jpeg",
    text: [
      "Sen Sivas’a gittikten sonra günler fazlasıyla eksik geçti. Sensizliğin bana en zor geldiği zaman dilimiydi.",
      "Seni yeniden gördüğüm an bütün özlemim yerini huzura bıraktı.",
      "Elimdeki çiçekler güzeldi ama o günün en güzel şeyi yine sendin. ❤️",
    ],
  },
  {
    id: 4,
    title: "Birlikte Anı Biriktirdiğimiz Gün",
    icon: "🌸",
    images: [
      "/images/son-bulusma-1.jpeg",
      "/images/son-bulusma-2.jpeg",
    ],
    text: [
      "Her hali huzur olan canım sevgilim benim.",
      "Senin yanında hiçbir şey yapmak zorunda olmadan, sadece yanında olmak bile bana yetiyor.",
      "Ve galiba bunun en güzel yanı, her buluşmada sana yeniden hayran olmam. 🤍",
    ],
  },
];

const reasons = [
  {
    id: 1,
    text: "Senin yanında hiçbir rol yapmıyorum. En doğal, en gerçek hâlimle sadece Ebrar olabiliyorum.",
  },
  {
    id: 2,
    text: "En kötü günümde bile bir mesajınla her şeyi biraz daha güzel hissettirebiliyorsun.",
  },
  {
    id: 3,
    text: "Bana sevgiyi sadece söyleyerek değil, gerçekten hissettirerek öğrettin.",
  },
  {
    id: 4,
    text: "Seninle sessizce oturmak bile bana dünyanın en güzel sohbeti gibi geliyor.",
  },
  {
    id: 5,
    text: "Bana değer verdiğini her zaman hissettiriyorsun ve bunun benim için ne kadar kıymetli olduğunu biliyorsun.",
  },
  {
    id: 6,
    text: "Güldüğünde ben de istemeden gülüyorum. Mutluluğun bana da bulaşıyor.",
  },
  {
    id: 7,
    text: "Gözlerinin içine baktığımda bütün stresim geçiyor ve kendimi huzurlu hissediyorum. Ve gözlerine âşığım.",
  },
  {
    id: 8,
    text: "Bazen hiçbir şey yapmadan, sadece yanında olmak bile bana yetiyor.",
  },
  {
    id: 9,
    text: "Geleceği seninle hayal etmek bana korkutucu değil, aksine çok güzel geliyor.",
  },
  {
    id: 10,
    text: "Sen yalnızca sevgilim değil, aynı zamanda en yakın arkadaşımsın.",
  },
  {
    id: 11,
    text: "O gün kamelyada bana “Sen artık benim manitamsın.” dediğin an, kalbimde unutamayacağım bir yere dönüştü.",
  },
  {
    id: 12,
    text: "Her buluşmamızda sana yeniden âşık oluyormuşum gibi hissediyorum.",
  },
  {
    id: 13,
    text: "İyi ki o gün yollarımız kesişmiş. Hayatımın en güzel tesadüfü sensin.",
  },
  {
    id: 14,
    text: "Seni tek bir sebepten dolayı sevmiyorum. Sen hayatımın her yerine iyi geldiğin için seviyorum. İyi ki varsın, iyi ki benimsin. ❤️",
  },
];

function App() {
  const [screen, setScreen] = useState("welcome");
  const [reasonsStarted, setReasonsStarted] = useState(false);
  const [reasonIndex, setReasonIndex] = useState(0);
  const [reasonDirection, setReasonDirection] = useState("next");
  const [capsuleOpened, setCapsuleOpened] = useState(false);
  const [finalOpened, setFinalOpened] = useState(false);

  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const memoryRefs = useRef([]);

  useEffect(() => {
    if (screen !== "loading") return;

    const timer = setTimeout(() => {
      setScreen("letter");
    }, 2200);

    return () => clearTimeout(timer);
  }, [screen]);

  useEffect(() => {
    if (screen !== "gallery") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("memory-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
      }
    );

    memoryRefs.current.forEach((card) => {
      if (card) {
        observer.observe(card);
      }
    });

    return () => observer.disconnect();
  }, [screen]);

  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, []);

  const waitForAudioMetadata = (audio) => {
    return new Promise((resolve) => {
      if (audio.readyState >= 1) {
        resolve();
        return;
      }

      const handleMetadata = () => {
        audio.removeEventListener("loadedmetadata", handleMetadata);
        resolve();
      };

      audio.addEventListener("loadedmetadata", handleMetadata);
      audio.load();
    });
  };

  const startMemoryMusic = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    try {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }

      await waitForAudioMetadata(audio);

      audio.pause();
      audio.currentTime = 61;
      audio.volume = 0;

      await audio.play();

      fadeIntervalRef.current = setInterval(() => {
        const nextVolume = Math.min(audio.volume + 0.03, 0.45);

        audio.volume = nextVolume;

        if (nextVolume >= 0.45) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
      }, 150);
    } catch (error) {
      console.error("Müzik başlatılamadı:", error);
    }
  };

  const resetMusic = () => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 61;
      audioRef.current.volume = 0;
    }
  };

  const openReasons = () => {
    setReasonIndex(0);
    setReasonDirection("next");
    setReasonsStarted(true);
  };

  const closeReasons = () => {
    setReasonsStarted(false);
    setReasonIndex(0);
    setReasonDirection("next");
  };

  const handleNextReason = () => {
    if (reasonIndex >= reasons.length - 1) return;

    setReasonDirection("next");
    setReasonIndex((currentIndex) => currentIndex + 1);
  };

  const handlePreviousReason = () => {
    if (reasonIndex <= 0) return;

    setReasonDirection("previous");
    setReasonIndex((currentIndex) => currentIndex - 1);
  };

  const restartStory = () => {
    resetMusic();

    setFinalOpened(false);
    setCapsuleOpened(false);
    setReasonsStarted(false);
    setReasonIndex(0);
    setReasonDirection("next");
    setScreen("welcome");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const relationshipStartDate = new Date("2025-09-28T00:00:00");
  const today = new Date();

  const daysTogether = Math.max(
    1,
    Math.floor(
      (today.getTime() - relationshipStartDate.getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1
  );

  return (
    <main className="page">
      <audio
        ref={audioRef}
        src="/music/sanki-ruya.mp3"
        preload="auto"
      />

      <div className="floating-heart heart-one">♡</div>
      <div className="floating-heart heart-two">♡</div>
      <div className="floating-heart heart-three">♡</div>

      {screen === "welcome" && (
        <section className="hero screen-animation">
          <div className="heart">💖</div>

          <p className="small-text">BUGÜN SENİN GÜNÜN...</p>

          <h1>
            Sana küçük bir
            <span> sürprizim var</span>
          </h1>

          <p className="description">
            Bu sayfayı sadece senin için hazırladım. Hazırsan birlikte küçük
            bir yolculuğa çıkalım.
          </p>

          <button
            type="button"
            className="open-button"
            onClick={() => setScreen("loading")}
          >
            Sürprizi Aç
            <span>💌</span>
          </button>
        </section>
      )}

      {screen === "loading" && (
        <section className="loading-screen screen-animation">
          <div className="envelope">💌</div>

          <p className="small-text">BİR SANİYE...</p>

          <h2>Mektubun hazırlanıyor</h2>

          <div className="loading-dots" aria-label="Yükleniyor">
            <span />
            <span />
            <span />
          </div>
        </section>
      )}

      {screen === "letter" && (
        <section className="letter-card screen-animation">
          <div className="letter-top">
            <span>Ömer'ime</span>
            <span>💗</span>
          </div>

          <div className="letter-content">
            <p className="letter-greeting">Ömer’im,</p>

            <p>
              Bugün senin doğum günün. Sana uzun uzun bir mesaj yazabilirdim
              ama bu kez sana, her açtığında benden küçük bir parça
              bulabileceğin özel bir yer hazırlamak istedim.
            </p>

            <p>
              Hayatıma girdiğin günden beri birçok şey daha güzel, daha
              anlamlı ve daha sıcak geliyor. Seninle güldüğüm her anı,
              konuştuğumuz her şeyi ve yanındayken hissettiğim huzuru çok
              seviyorum.
            </p>

            <p>
              İyi ki doğdun Ömer’im. İyi ki hayatımdasın. İyi ki bana
              sevgililiği, arkadaşlığı ve sevgiyi aynı kişide
              hissettiriyorsun.
            </p>

            <p className="letter-ending">
              Seni çok seviyorum.
              <span>Ebrar’ın 💖</span>
            </p>
          </div>

          <button
            type="button"
            className="continue-button"
            onClick={() => setScreen("memories")}
          >
            Hikâyemize devam et
            <span>→</span>
          </button>
        </section>
      )}

      {screen === "memories" && (
        <section className="memory-placeholder screen-animation">
          <p className="small-text">HİKAYEMİZİN BAŞLANGICI</p>

          <div className="date-card">
            <span className="date-icon">✨</span>

            <div>
              <strong>27 Ağustos 2025</strong>

              <p>
                Hayatımın en güzel tesadüflerinden biriyle tanıştığım gün.
              </p>
            </div>
          </div>

          <div className="date-card">
            <span className="date-icon">💞</span>

            <div>
              <strong>28 Eylül 2025</strong>

              <p>
                Kamelyada, “Sen artık benim manitamsın” diyerek hikâyemize
                isim koyduğun gün.
              </p>
            </div>
          </div>

          <p className="coming-next">
            Bu iki tarihle başlayan hikâyemizde biriktirdiğimiz güzel anlara
            bakalım mı?
          </p>

          <button
            type="button"
            className="continue-button"
            onClick={() => {
              setScreen("gallery");
              startMemoryMusic();
            }}
          >
            Anılarımızı aç
            <span>📷</span>
          </button>
        </section>
      )}

      {screen === "gallery" && (
        <section className="gallery-screen screen-animation">
          <header className="gallery-header">
            <p className="small-text">BİZİM KÜÇÜK ALBÜMÜMÜZ</p>

            <h2>Anılarımız</h2>

            <p>
              Her fotoğrafımız, birlikte yazdığımız hikâyenin küçük bir
              parçası...
            </p>
          </header>

          <div className="memory-list">
            {memories.map((memory, index) => (
              <article
                ref={(element) => {
                  memoryRefs.current[index] = element;
                }}
                className={`memory-card memory-card-${index + 1}`}
                key={memory.id}
              >
                <div className="memory-number">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>

                <div className="memory-card-heading">
                  <span className="memory-icon">{memory.icon}</span>

                  <div>
                    <h3>{memory.title}</h3>
                  </div>
                </div>

                {memory.image && (
                  <div className="memory-image-wrapper">
                    <img
                      src={memory.image}
                      alt={`${memory.title} fotoğrafımız`}
                      className="memory-image"
                    />
                  </div>
                )}

                {memory.images && (
                  <div className="memory-image-stack">
                    {memory.images.map((image, imageIndex) => (
                      <div
                        className="memory-image-wrapper"
                        key={`${memory.id}-${imageIndex}`}
                      >
                        <img
                          src={image}
                          alt={`${memory.title} ${imageIndex + 1}. fotoğraf`}
                          className="memory-image"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="memory-note">
                  <span className="memory-note-heart">♡</span>

                  {memory.text.map((paragraph, paragraphIndex) => (
                    <p key={`${memory.id}-${paragraphIndex}`}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="album-ending">
            <span>♡</span>

            <p>
              Her fotoğrafımızı çok seviyorum ama galiba en sevdiğim fotoğraf
              henüz çekmediğimiz...
            </p>

            <button
              type="button"
              className="continue-button"
              onClick={() => setScreen("future")}
            >
              Nedenini öğren
              <span>→</span>
            </button>
          </div>
        </section>
      )}

      {screen === "future" && (
        <section className="future-screen screen-animation">
          <div className="future-heart">♡</div>

          <p className="future-intro">BİLİYOR MUSUN?</p>

          <h2>
            En sevdiğim fotoğraf,
            <span>henüz çekmediğimiz fotoğraf.</span>
          </h2>

          <p>
            Çünkü seninle daha gideceğimiz yollar, içeceğimiz kahveler,
            tutacağımız ellerimiz ve birlikte kutlayacağımız nice doğum günleri
            var.
          </p>

          <p className="future-highlight">
            Önümüzde birlikte biriktireceğimiz koskoca bir ömür var inşallah
            sevgilim. 🤍
          </p>

          <button
            type="button"
            className="continue-button"
            onClick={() => {
              setReasonsStarted(false);
              setReasonIndex(0);
              setReasonDirection("next");
              setScreen("reasons");
            }}
          >
            Sana anlatacaklarım bitmedi
            <span>💗</span>
          </button>
        </section>
      )}

      {screen === "reasons" && (
        <section className="reasons-page screen-animation">
          <div className="reasons-background-heart reasons-heart-one">
            ♡
          </div>

          <div className="reasons-background-heart reasons-heart-two">
            ♡
          </div>

          <div className="reasons-background-heart reasons-heart-three">
            ♡
          </div>

          {!reasonsStarted ? (
            <div className="reasons-intro">
              <span className="reasons-intro-heart">♡</span>

              <p className="reasons-intro-small">
                Bazı şeylerin tek bir sebebi olmaz.
              </p>

              <h1>
                Ama seni neden sevdiğimi
                <span> anlatmaya çalışacağım.</span>
              </h1>

              <button
                type="button"
                className="reasons-start-button"
                onClick={openReasons}
              >
                Hazırım 💖
              </button>
            </div>
          ) : (
            <div className="reasons-container">
              <header className="reasons-header">
                <button
                  type="button"
                  className="reasons-close-button"
                  onClick={closeReasons}
                  aria-label="Nedenler giriş ekranına dön"
                >
                  ←
                </button>

                <span className="reasons-counter">
                  {reasonIndex + 1} / {reasons.length}
                </span>
              </header>

              <article
                key={reasonIndex}
                className={`reason-card reason-card-${reasonDirection}`}
              >
                <span className="reason-card-heart">
                  {reasonIndex === reasons.length - 1 ? "💖" : "♡"}
                </span>

                <p className="reason-prefix">Çünkü...</p>

                <p className="reason-text">{reasons[reasonIndex].text}</p>
              </article>

              <div className="reason-progress">
                {reasons.map((reason, index) => (
                  <span
                    key={reason.id}
                    className={`reason-progress-dot ${
                      index === reasonIndex
                        ? "reason-progress-dot-active"
                        : ""
                    }`}
                  />
                ))}
              </div>

              <div className="reasons-navigation">
                <button
                  type="button"
                  className="reason-navigation-button"
                  onClick={handlePreviousReason}
                  disabled={reasonIndex === 0}
                >
                  ← Önceki
                </button>

                {reasonIndex < reasons.length - 1 ? (
                  <button
                    type="button"
                    className="reason-navigation-button reason-next-button"
                    onClick={handleNextReason}
                  >
                    Sonraki →
                  </button>
                ) : (
                  <button
                    type="button"
                    className="reason-navigation-button reason-continue-button"
                    onClick={() => {
                      setCapsuleOpened(false);
                      setScreen("timeCapsule");
                    }}
                  >
                    Devam et →
                  </button>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {screen === "timeCapsule" && (
        <section className="time-capsule-page screen-animation">
          <div className="capsule-background-heart capsule-heart-one">♡</div>
          <div className="capsule-background-heart capsule-heart-two">♡</div>
          <div className="capsule-background-heart capsule-heart-three">♡</div>

          {!capsuleOpened ? (
            <div className="capsule-intro">
              <div className="capsule-envelope">💌</div>

              <p className="capsule-small-text">Bir mektup daha var...</p>

              <h2>
                Ama bu mektup
                <span>bugünkü bize değil.</span>
              </h2>

              <p className="capsule-description">
                Bu mektubu, gelecekte bir gün yeniden okuyalım diye buraya
                bırakıyorum.
              </p>

              <button
                type="button"
                className="capsule-open-button"
                onClick={() => setCapsuleOpened(true)}
              >
                Zaman kapsülünü aç
                <span>♡</span>
              </button>
            </div>
          ) : (
            <article className="capsule-letter">
              <div className="capsule-letter-top">
                <span>Gelecekteki Ömer ve Ebrar’a</span>
                <span>🤍</span>
              </div>

              <div className="capsule-letter-content">
                <p className="capsule-greeting">Sevgili biz...</p>

                <p>
                  Bu satırları, birbirimizi çok sevdiğimiz ve önümüzde birlikte
                  yaşayacağımız koskoca bir hayat olduğuna inandığımız bir
                  günden yazıyorum.
                </p>

                <p>
                  Umarım bu mektubu okuduğumuz gün hâlâ birbirimize aynı
                  sevgiyle bakıyoruzdur. Belki hayatımız değişmiştir, belki
                  farklı bir şehirdeyizdir (ben Sivas’tayımdır ajfhjskdlf),
                  belki de şu an hayalini kurduğumuz birçok şeyi birlikte
                  gerçekleştirmişizdir.
                </p>

                <p>
                  Umarım hâlâ birlikte kahve içiyor, küçük şeylere gülüyor ve
                  birbirimizi her koşulda seçmeye devam ediyoruzdur.
                </p>

                <p>
                  Ne yaşarsak yaşayalım, bugün hissettiğimiz bu sevgiyi
                  unutmayalım. Çünkü bizim hikâyemiz büyük anlardan değil,
                  birbirimizi her gün yeniden seçtiğimiz küçük anlardan
                  oluşuyor.
                </p>

                <p className="capsule-highlight">
                  Gelecekteki bize küçük bir hatırlatma:
                  <span>Biz birbirimizi çok güzel sevdik.</span>
                </p>

                <p className="capsule-ending">
                  Umarım hep “biz” olarak kalmışızdır.
                  <span>Geçmişteki Ebrar’dan 🤍</span>
                </p>
              </div>

              <button
                type="button"
                className="continue-button"
                onClick={() => {
                  setFinalOpened(false);
                  setScreen("final");
                }}
              >
                Son bir sürpriz daha var
                <span>→</span>
              </button>
            </article>
          )}
        </section>
      )}

      {screen === "final" && (
        <section className="final-page screen-animation">
          <div className="final-glow final-glow-one" />
          <div className="final-glow final-glow-two" />

          <div className="final-floating-symbol final-symbol-one">♡</div>
          <div className="final-floating-symbol final-symbol-two">♡</div>
          <div className="final-floating-symbol final-symbol-three">✦</div>

          {!finalOpened ? (
            <div className="final-intro-card">
              <span className="final-small-title">Ve şimdi...</span>

              <div className="final-gift">🎁</div>

              <h2>
                Hikâyemizin bugüne kadar süren
                <span>küçük bir özeti var.</span>
              </h2>

              <div className="days-together-card">
                <span className="days-number">{daysTogether}</span>
                <span className="days-label">gündür biziz</span>
              </div>

              <p className="final-intro-description">
                Her günümüz kusursuz değildi belki ama seninle geçen her gün,
                hikâyemizin bir parçası oldu.
              </p>

              <button
                type="button"
                className="final-open-button"
                onClick={() => setFinalOpened(true)}
              >
                Son sürprizi aç
                <span>💖</span>
              </button>
            </div>
          ) : (
            <div className="final-message-card">
              <div className="heart-rain" aria-hidden="true">
                {Array.from({ length: 18 }).map((_, index) => (
                  <span
                    key={index}
                    style={{
                      "--heart-index": index,
                      "--heart-left": `${(index * 17) % 100}%`,
                      "--heart-delay": `${(index % 7) * 0.35}s`,
                      "--heart-duration": `${4.5 + (index % 5) * 0.6}s`,
                    }}
                  >
                    {index % 3 === 0 ? "💗" : "♡"}
                  </span>
                ))}
              </div>

              <div className="final-main-heart">❤️</div>

              <p className="final-eyebrow">İYİ Kİ DOĞDUN ÖMER'İM</p>

              <h1>
                Bu site bitebilir,
                <span>ama bizim hikâyemiz daha yeni başlıyor.</span>
              </h1>

              <div className="final-divider">
                <span />
                <b>♡</b>
                <span />
              </div>

              <div className="final-message-text">
                <p>
                  Hayatıma geldiğin, bana sevgiyi bu kadar güzel hissettirdiğin
                  ve her günümü biraz daha anlamlı yaptığın için sana çok
                  teşekkür ederim.
                </p>

                <p>
                  Yeni yaşında o güzel yüzünün hep gülmesini, kalbinin hep
                  huzurlu olmasını ve kurduğun bütün hayallerin birer birer
                  gerçekleşmesini diliyorum canım sevgilim.
                </p>

                <p>
                  Ve bütün bu güzel günlerde, mutluluklarında, heyecanlarında
                  ve kurduğun hayallerde yanında olmayı çok istiyorum.
                </p>
              </div>

              <p className="final-highlight-message">
                Bugün senin doğum günün olabilir...
                <span>
                  Ama sen benim hayatıma verilmiş en güzel hediyesin.
                </span>
              </p>

              <div className="final-signature">
                <span>Seni her şeyden çok seven</span>
                <strong>Ebrar’ın 💖</strong>
              </div>

              <button
                type="button"
                className="final-restart-button"
                onClick={restartStory}
              >
                Hikâyemizi baştan izle
                <span>↻</span>
              </button>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default App;