function About() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
      <div className="max-w-2xl">
        <p className="mb-6 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">About</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Making workplace information easier to find.</h1>
        <div className="mt-8 space-y-6 text-base leading-8 text-muted-foreground">
          <p><span title="Workscope Nepal: horoscope for your future and career">Workscope Nepal</span> is an open-source project focused on information about Nepalese IT companies and the working lives around them.</p>
          <p>People looking for jobs, preparing for interviews, or considering a change often have to piece together information from scattered conversations and sources. This project aims to create a more centralized, community-driven place for that context.</p>
          <p>The long-term vision is a useful reference for company information, workplace experiences, salaries, interviews, culture, benefits, and related career information. The platform is still being built, and this early foundation makes room for that work to happen carefully.</p>
        </div>
      </div>
    </section>
  );
}

export default About;
