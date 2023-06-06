import Head from 'next/head'
import MidiWriter from 'midi-writer-js';
import styles from '@/styles/home.module.css'
import { useState } from 'react';

export default function Home() {

  // set notes
  // order from highest to lowest
  const allNotes = ['C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4']
  const [activeNotes, setActiveNotes] = useState([])

  function download() {
    var link = document.createElement("a");
    link.download = "melody.mid";

    // make track
    const track = new MidiWriter.Track();
    track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: 1}));
    
    const activeNotesDict = {1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: []}
    for (const note of activeNotes){
      let barNum = note.split(":")[0];
      let noteName = note.split(":")[1]
      let barArray = activeNotesDict[barNum]
      barArray.push(noteName)
      activeNotesDict[barNum] = barArray
    }

    for (const barNumber of [1, 2, 3, 4, 5, 6, 7, 8]){
      const note = new MidiWriter.NoteEvent({pitch: activeNotesDict[barNumber], duration: '1'});
      track.addEvent(note);
    }
    const write = new MidiWriter.Writer(track);

    link.href = write.dataUri();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function clickNote(note){
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
        <div className={styles.grid}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((bar, index) => (
            <>
              <div className={styles.column}>
                <p>{bar}</p>
                {allNotes.map((note, index) => (
                  <div key={index} className={styles.notebutton + (activeNotes.includes(bar + ":" + note) ? ` ${styles[note.split("")[0]]}` : "")} onClick={() => clickNote(bar + ":" + note)}/>
                ))}
              </div>
            </>
          ))}
        </div>
        <br/><button onClick={download}>Download</button>
      </main>
    </>
  )
}
