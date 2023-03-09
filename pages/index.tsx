import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";

import Map from "./components/Map";
import Header from "./components/Header";

import { useImmer } from "use-immer";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [markers, setMarkers] = useImmer<mapit.Marker[]>([]);
  const [menu, setMenu] = useState<mapit.menu>("style");
  const [options, setOptions] = useImmer<google.maps.MapOptions>({
    zoom: 2,
    zoomControl: false,
    minZoom: 2,
    maxZoom: 16,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    zoomControlOptions: {
      position: 9,
    },
    styles: [],
  });
  return (
    <>
      <Head>
        <title>Mapit</title>
        <meta name="description" content="A Custom Google Map Builder" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Header
          options={options}
          setOptions={setOptions}
          markers={markers}
          setMarkers={setMarkers}
          menu={menu}
          setMenu={setMenu}
        />
        <Map
          options={options}
          setOptions={setOptions}
          markers={markers}
          setMarkers={setMarkers}
          menu={menu}
          setMenu={setMenu}
        />
      </main>
    </>
  );
}
