'use client';

import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

let SpaceScene = lazy(() =>
  import("@/components/SpaceScene").then(m => ({
    default: m.SpaceScene,
  }))
);

import nexusEmblem from "@/assets/nexus-emblem.png";
import tlemcenLogo from "@/assets/ilc-logo.jpg";
import ilcLogo from "@/assets/miloud.jpg";

import {
  Users,
  Globe,
  Lightbulb,
  Handshake,
  Star,
  Instagram,
  Mail,
  MapPin,
} from "lucide-react";

import { OrnateBorder } from "@/components/Ornaments";

export const Route = createFileRoute("/")({
  component: Index,

  head: () => ({
    meta: [
      {
        title: "NEXUS Club — Connecting Cultures, Creating Unity",
      },

      {
        name: "description",
        content:
          "نادي نيكسوس — مركز التعليم المكثف للغات، جامعة أحمد بن يحيى الونشريسي تيسمسيلت",
      },
    ],
  }),
});

function Index() {
  return (
    <div
      dir="ltr"
      className="relative min-h-screen overflow-visible text-foreground"
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #382b2b 0%, #000000 50%, #000000 100%)",
      }}
    >
      <Suspense fallback={null}>
        <SpaceScene />
      </Suspense>

      {/* MAIN */}
      <main className="relative z-10 mx-auto w-full max-w-[1100px] px-6 pt-10 pb-16">

        {/* HEADER */}
        <header className="relative">
          <div className="relative rounded-2xl border border-gold/70 bg-background/70 backdrop-blur-md px-6 py-8">

            <OrnateBorder />

            <div className="flex flex-col md:flex-row items-center gap-6">

              {/* LEFT LOGO */}
              <img
                src={tlemcenLogo}
                alt="University"
                width={100}
                height={100}
                className="
                  h-24
                  w-24
                  shrink-0
                  rounded-full
                  ring-2
                  ring-gold/70
                "
              />

              {/* CENTER */}
              <div className="flex-1 text-center font-arabic">

                <p
                  dir="rtl"
                  className="text-sm text-foreground/85 leading-tight"
                >
                  الجمهورية الجزائرية الديمقراطية الشعبية
                </p>

                <p
                  dir="rtl"
                  className="text-sm text-foreground/85 leading-tight mt-1"
                >
                  وزارة التعليم العالي والبحث العلمي
                </p>

                <h1
                  dir="rtl"
                  className="gold-gradient text-3xl sm:text-4xl font-bold leading-tight mt-3"
                >
                  جامعة أحمد بن يحيى الونشريسي
                </h1>

                <p
                  dir="rtl"
                  className="text-sm text-foreground/70 mt-2"
                >
                  مركز التعليم المكثف للغات — جامعة تيسمسيلت
                </p>
              </div>

              {/* RIGHT LOGO */}
              <img
                src={ilcLogo}
                alt="ILC"
                width={100}
                height={100}
                className="
                  h-24
                  w-24
                  shrink-0
                  rounded-full
                  object-cover
                  ring-2
                  ring-gold/70
                "
              />
            </div>
          </div>
        </header>

        {/* HERO */}
        <section className="mt-24 flex flex-col items-center text-center">

          <div className="relative">

            {/* GLOW */}
            <div className="
              absolute
              inset-0
              -m-20
              rounded-full
              bg-[radial-gradient(circle,oklch(0.78_0.13_78/0.45),transparent_60%)]
              blur-3xl
            " />

            {/* MAIN LOGO */}
            <img
              src={nexusEmblem}
              alt="Nexus Club Emblem"
              width={2048}
              height={2048}
              className="
                relative
                w-[350px]
                sm:w-[500px]
                md:w-[650px]
                lg:w-[850px]
                xl:w-[1000px]
                mix-blend-screen
              "
            />
          </div>

          {/* TITLE */}
          <h2 className="
            font-display
            gold-gradient
            glow-gold
            text-6xl
            sm:text-7xl
            md:text-8xl
            mt-12
            tracking-[0.35em]
          ">
            NEXUS
          </h2>

          <p className="
            font-display
            text-gold
            tracking-[0.7em]
            text-xl
            mt-3
          ">
            CLUB
          </p>

          <p className="
            font-display
            text-foreground/75
            text-sm
            tracking-[0.55em]
            mt-5
          ">
            CONNECTING CULTURES, CREATING UNITY.
          </p>
        </section>

        {/* QUOTE */}
        <section className="relative mt-24">

          <div className="
            relative
            mx-auto
            max-w-[650px]
            rounded-2xl
            border
            border-gold/70
            bg-background/70
            backdrop-blur-md
            px-10
            py-12
            text-center
          ">
            <OrnateBorder />

            <p
              dir="rtl"
              className="
                font-arabic
                text-4xl
                md:text-5xl
                gold-gradient
                leading-relaxed
              "
            >
              نجمع الكون… في فكرة
            </p>
          </div>
        </section>

        {/* VALUES */}
        <section className="relative mt-20">

          <div className="
            relative
            rounded-2xl
            border
            border-gold/70
            bg-background/80
            backdrop-blur-md
            px-6
            py-14
          ">
            <OrnateBorder />

            <div className="
              grid
              grid-cols-1
              md:grid-cols-5
              gap-8
              text-center
            ">

              {/* N */}
              <div className="flex flex-col items-center">
                <h3 className="font-display gold-gradient text-5xl mb-5">
                  N
                </h3>

                <p className="italic text-sm min-h-[90px] flex items-center">
                  Nexsfra diversita: l'est nostra fortza
                </p>

                <span className="mt-4 mb-5 h-px w-12 bg-gold/60" />

                <Users
                  className="h-8 w-8 text-gold"
                  strokeWidth={1.5}
                />
              </div>

              {/* E */}
              <div className="flex flex-col items-center">
                <h3 className="font-display gold-gradient text-5xl mb-5">
                  E
                </h3>

                <p className="italic text-sm min-h-[90px] flex items-center">
                  Edungor les liens, les cultures et les perspectives
                </p>

                <span className="mt-4 mb-5 h-px w-12 bg-gold/60" />

                <Globe
                  className="h-8 w-8 text-gold"
                  strokeWidth={1.5}
                />
              </div>

              {/* X */}
              <div className="flex flex-col items-center">
                <h3 className="font-display gold-gradient text-5xl mb-5">
                  X
                </h3>

                <p
                  dir="rtl"
                  className="
                    font-arabic
                    text-lg
                    min-h-[90px]
                    flex
                    items-center
                  "
                >
                  أنت المتغيِّر
                </p>

                <span className="mt-4 mb-5 h-px w-12 bg-gold/60" />

                <Lightbulb
                  className="h-8 w-8 text-gold"
                  strokeWidth={1.5}
                />
              </div>

              {/* U */}
              <div className="flex flex-col items-center">
                <h3 className="font-display gold-gradient text-5xl mb-5">
                  U
                </h3>

                <p className="italic text-sm min-h-[90px] flex items-center">
                  Unitate diver à conifate
                </p>

                <span className="mt-4 mb-5 h-px w-12 bg-gold/60" />

                <Handshake
                  className="h-8 w-8 text-gold"
                  strokeWidth={1.5}
                />
              </div>

              {/* S */}
              <div className="flex flex-col items-center">
                <h3 className="font-display gold-gradient text-5xl mb-5">
                  S
                </h3>

                <p className="italic text-sm min-h-[90px] flex items-center">
                  Skills define your identity
                </p>

                <span className="mt-4 mb-5 h-px w-12 bg-gold/60" />

                <Star
                  className="h-8 w-8 text-gold"
                  strokeWidth={1.5}
                />
              </div>

            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="
          mt-14
          flex
          flex-col
          items-center
          text-center
          gap-5
        ">
          <p
            dir="rtl"
            className="
              font-arabic
              text-2xl
              text-foreground/95
            "
          >
            <span className="text-gold mx-3">◆</span>

            انضم إلينا … وكن جزءًا من التغيير

            <span className="text-gold mx-3">◆</span>
          </p>
        </section>

        {/* FOOTER */}
        <footer className="
          mt-12
          flex
          flex-wrap
          items-center
          justify-center
          gap-x-6
          gap-y-3
          text-sm
          text-foreground/80
        ">

          <span className="inline-flex items-center gap-2">
            <Instagram className="h-4 w-4 text-gold" />
            <span>@nexus.club.te</span>
          </span>

          <span className="inline-flex items-center gap-2">
            <Mail className="h-4 w-4 text-gold" />
            <span>nexus.club@gmail.com</span>
          </span>

          <span
            dir="rtl"
            className="inline-flex items-center gap-2 font-arabic"
          >
            <MapPin className="h-4 w-4 text-gold" />
            <span>مركز التعليم المكثف للغات</span>
          </span>
        </footer>
      </main>
    </div>
  );
}

export default Index;
