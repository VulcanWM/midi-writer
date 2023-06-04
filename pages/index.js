import Head from 'next/head'
import MidiWriter from 'midi-writer-js';
import styles from '@/styles/home.module.css'
import { useState } from 'react';

export default function Home() {

  // set notes
  const allNotes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A5', 'B5', 'C5']
  const [activeNotes, setActiveNotes] = useState([])

  function download() {
    var link = document.createElement("a");
    link.download = "melody.mid";

    // make track
    const track = new MidiWriter.Track();
    track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: 1}));
    for (const noteName of activeNotes){
      const note = new MidiWriter.NoteEvent({pitch: [noteName], duration: '1'});
      track.addEvent(note);
    }
    const write = new MidiWriter.Writer(track);

    link.href = write.dataUri();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function clickNote(note){
    console.log(note)
    if (activeNotes.includes(note)){
      // remove note
      setActiveNotes(
        activeNotes.filter(a =>
          a !== note
        )
      );
    } else {
      // add note
      setActiveNotes([
        ...activeNotes,
        note
      ]);
    }
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
        <p>{activeNotes}</p>
        {allNotes.map((note, index) => (
          <div key={index} className={styles.notebutton + (activeNotes.includes(note) ? ` ${styles[note.split("")[0]]}` : "")} onClick={() => clickNote(note)}/>
        ))}
        <br/><button onClick={download}>Download</button>
      </main>
    </>
  )
}
