import Head from 'next/head'
import MidiWriter from 'midi-writer-js';
import styles from '@/styles/home.module.css'

export default function Home() {
  const track = new MidiWriter.Track();

  // Define an instrument (optional):
  track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: 1}));

  // Add some notes:
  const note = new MidiWriter.NoteEvent({pitch: ['C4', 'D4', 'E4'], duration: '4'});
  track.addEvent(note);

  // Generate a data URI
  const write = new MidiWriter.Writer(track);
  const downloadUri = write.dataUri()
  function download(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  return (
    <>
      <Head>
        <title>Midi Writer</title>
        <meta name="description" content="idk" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Hello</h1>
        <button onClick={() => (download(downloadUri, "hello.mid"))}>Download</button>
      </main>
    </>
  )
}
