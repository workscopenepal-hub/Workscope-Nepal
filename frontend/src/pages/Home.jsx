function Home() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
      <div className="max-w-3xl">
        <p className="mb-6 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <span title="Workscope Nepal: horoscope for your future and career">Workscope Nepal</span>
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          A clearer view of Nepal&apos;s technology workplaces.
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
          Workscope Nepal is being built to bring workplace information about Nepalese IT companies into one thoughtful, community-driven place.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-5">
          <a
            className="inline-flex items-center justify-center rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background"
            href="/about"
          >
            Learn more about the project
          </a>
          <a className="text-sm font-medium text-foreground underline underline-offset-4" href="/companies">
            View company directory
          </a>
        </div>
      </div>

      <div className="mt-24 grid max-w-4xl gap-10 border-t border-border pt-8 text-sm sm:grid-cols-3">
        <div>
          <h2 className="font-medium text-foreground">The problem</h2>
          <p className="mt-2 leading-6 text-muted-foreground">Information about local technology workplaces is often scattered and difficult to compare.</p>
        </div>
        <div>
          <h2 className="font-medium text-foreground">The direction</h2>
          <p className="mt-2 leading-6 text-muted-foreground">Build a useful, honest, and accessible reference for people navigating Nepal&apos;s IT sector.</p>
        </div>
        <div>
          <h2 className="font-medium text-foreground">The stage</h2>
          <p className="mt-2 leading-6 text-muted-foreground">The platform is currently in its early foundation stage.</p>
        </div>
      </div>
    </section>
  );
}

export default Home;
