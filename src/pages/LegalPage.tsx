import React from 'react';
import { Link } from 'react-router-dom';
import { Printer } from 'lucide-react';
import { legalDocuments, type LegalDocumentId } from '../config/legal';
import { useLanguage } from '../context/LanguageContext';
import { legalContent, legalUi } from '../i18n/legalContent';

export function LegalPage({ type }: { type: LegalDocumentId }) {
  const { language, dir } = useLanguage();
  const content = legalContent[language][type];
  const ui = legalUi[language];
  const configuration = legalDocuments[type];
  const published = configuration.publicationStatus === 'published';
  const metadata = published
    ? ui.publishedMetadata(configuration.version!, configuration.effectiveDate!, configuration.lastUpdatedDate!)
    : ui.draftMetadata;

  return <main className="legal-page min-h-screen bg-dark-950 px-4 pb-20 pt-28 sm:px-6 sm:pt-32" dir={dir}>
    <article className="mx-auto max-w-6xl" aria-labelledby="legal-title">
      <header className="border-b border-white/10 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className={`rounded-full border px-4 py-2 text-sm font-semibold ${published ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200' : 'border-amber-400/30 bg-amber-400/10 text-amber-300'}`}>{published ? ui.published : ui.draft}</p>
          <button type="button" onClick={() => window.print()} className="legal-print inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-semibold text-slate-200 hover:bg-white/5"><Printer className="h-4 w-4" aria-hidden="true" />{published ? ui.printPublished : ui.print}</button>
        </div>
        <h1 id="legal-title" className="mt-6 text-4xl font-bold text-white sm:text-5xl">{content.title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{content.summary}</p>
        <p className="mt-4 text-sm text-slate-400">{metadata}</p>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className={`rounded-2xl border p-5 text-sm leading-6 ${published ? 'border-cyan-400/20 bg-cyan-400/5 text-slate-300' : 'border-amber-400/25 bg-amber-400/5 text-amber-100'}`}>{published ? ui.publishedNotice : ui.notice}</div>
          <nav className="mt-6 rounded-2xl border border-white/10 bg-dark-800 p-5" aria-label={ui.contents}>
            <h2 className="font-semibold text-white">{ui.contents}</h2>
            <ol className="mt-3 space-y-1">
              {content.sections.map((section) => <li key={section.id}><a href={`#${section.id}`} className="flex min-h-10 items-center rounded-lg px-2 text-sm text-slate-400 hover:bg-white/5 hover:text-brand-400">{section.title}</a></li>)}
            </ol>
          </nav>
        </aside>

        <div className="min-w-0 space-y-5">
          {content.sections.map((section) => <section id={section.id} key={section.id} className="legal-section scroll-mt-28 rounded-2xl border border-white/10 bg-dark-800 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white sm:text-2xl">{section.title}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 leading-8 text-slate-300">{paragraph}</p>)}
            {section.bullets && <ul className="mt-4 list-disc space-y-2 ps-6 text-slate-300">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
          </section>)}
        </div>
      </div>
      <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-slate-400">
        <span>{configuration.status === 'draft' ? ui.draft : `${content.shortTitle} · ${configuration.version}`}</span>
        <Link to="/" className="inline-flex min-h-11 items-center text-brand-400 hover:text-brand-300">{ui.back}</Link>
      </footer>
    </article>
  </main>;
}
