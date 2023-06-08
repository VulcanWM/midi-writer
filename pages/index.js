import Head from 'next/head'
import MidiWriter from 'midi-writer-js';
import styles from '@/styles/home.module.css'
import { useState } from 'react';
import MidiPlayer from 'midi-player-js';

export default function Home() {
  const [activeBar, setActiveBar] = useState("0")
  const Player = new MidiPlayer.Player(function(event) {
    // console.log(event);
  });
  Player.on('fileLoaded', function() {
    setActiveBar("1")
  });

  Player.on('playing', function(currentTick) {
    setActiveBar(Math.round(currentTick.tick/128+1))
  });
  Player.on('endOfFile', function() {
    setActiveBar("0")
  });
  
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

    const activeNotesDict = {}
    for (const note of activeNotes){
      let barNum = note.split(":")[0];
      let noteName = note.split(":")[1]
      let barArray = activeNotesDict[barNum] || []
      barArray.push(noteName)
      activeNotesDict[barNum] = barArray
    }

    for (const barNumber of [1, 2, 3, 4, 5, 6, 7, 8]){
      const note = new MidiWriter.NoteEvent({pitch: activeNotesDict[barNumber], duration: '4'});
      track.addEvent(note);
    }
    const write = new MidiWriter.Writer(track);
    link.href = write.dataUri();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function play() {
    // make track
    const track = new MidiWriter.Track();
    track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: 1}));

    const activeNotesDict = {}
    for (const note of activeNotes){
      let barNum = note.split(":")[0];
      let noteName = note.split(":")[1]
      let barArray = activeNotesDict[barNum] || []
      barArray.push(noteName)
      activeNotesDict[barNum] = barArray
    }

    for (const barNumber of [1, 2, 3, 4, 5, 6, 7, 8]){
      const note = new MidiWriter.NoteEvent({pitch: activeNotesDict[barNumber], duration: '4'});
      track.addEvent(note);
    }
    const write = new MidiWriter.Writer(track);
    Player.loadDataUri(write.dataUri())
    Player.play()
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
        <div className={styles.grid}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((bar, index) => (
            <>
              {bar == 0 ? 
                <div className={styles.column}>
                  <p>-</p>
                  {allNotes.map((note, index) => (
                    <div className={styles.notename}>{note}</div>
                  ))}
                </div> 
              : 
                <div className={styles.column + (activeBar == bar ? ` ${styles.activecolumn}`: "")}>
                  <p>{bar}</p>
                  {allNotes.map((note, index) => (
                    <div key={index} className={styles.notebutton + (activeNotes.includes(bar + ":" + note) ? ` ${styles[note.split("")[0]]}` : "")} onClick={() => clickNote(bar + ":" + note)}/>
                  ))}
                </div>
               }
            </>
          ))}
        </div>
        <br/><button onClick={play}>Play</button>
        <br/><button onClick={download}>Download</button>
      </main>
    </>
  )
}
