import PhotoPicker from "./photo-picker";

export default function Home() {
  return (
    <main className="wedding-invite" aria-labelledby="couple-names">
      <div className="invite-stage">
        <h1 className="invite-title" id="couple-names">
          GALERI GAMBAR KAHWIN IMAN &amp; SYAHMI!
        </h1>
        <p className="invite-date">
          <time dateTime="2027-01-02">2 JANUARI 2027</time>
          <span aria-hidden="true"> | </span>
          <time dateTime="2027-01-09">9 JANUARI 2027</time>
        </p>

        <div className="invite-illustration">
          {/* This illustration is the original static artwork from the Figma frame. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/wedding-couple-illustration.png"
            alt="A hand-drawn couple embracing inside a red heart, with the greeting Selamat Pengantin Baru and the names Iman and Syahmi."
            width="920"
            height="1084"
            fetchPriority="high"
          />
        </div>

        <PhotoPicker />

        <a className="invite-action invite-album" href="/gallery">
          VIEW ALBUM
        </a>
      </div>
    </main>
  );
}
