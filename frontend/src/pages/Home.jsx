function Home() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
      <div className="max-w-3xl">
        <p className="mb-6 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <span title="Workscope Nepal: horoscope for your future and career">Workscope Nepal</span>
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          Discover Nepal&apos;s technology ecosystem.
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
          Workscope Nepal brings useful information about companies, events, communities, opportunities, and other technology resources into one organized place. It is being built for anyone trying to understand what is happening in Nepal&apos;s technology sector and where they might fit in.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-5">
          <a
            className="inline-flex items-center justify-center rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background"
            href="/about"
          >
            Learn About Workscope
          </a>
          <a className="text-sm font-medium text-foreground underline underline-offset-4" href="/companies">
            Explore Companies
          </a>
        </div>
      </div>

      <div className="mt-24 grid max-w-4xl gap-10 border-t border-border pt-8 text-sm sm:grid-cols-3">
        <div>
          <h2 className="font-medium text-foreground">The problem</h2>
          <p className="mt-2 leading-6 text-muted-foreground">Information about Nepal&apos;s technology sector is spread across company websites, social platforms, event pages, and community conversations. Finding an internship, event, community, or useful starting point can take more searching than it should.</p>
        </div>
        <div>
          <h2 className="font-medium text-foreground">The direction</h2>
          <p className="mt-2 leading-6 text-muted-foreground">Build a useful, accessible information center for Nepal&apos;s technology ecosystem, bringing companies, opportunities, events, communities, and learning resources together.</p>
        </div>
        <div>
          <h2 className="font-medium text-foreground">The stage</h2>
          <p className="mt-2 leading-6 text-muted-foreground">The foundation is being built carefully. More categories and information will be added over time, with the community helping make the resource more useful and complete.</p>
        </div>
      </div>
    </section>
  );
}

export default Home;
