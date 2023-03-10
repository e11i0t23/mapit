import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";

import Map from "./components/Map";
import Header from "./components/Header";

import { useImmer } from "use-immer";
import { useState, useMemo, useRef } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [markers, setMarkers] = useImmer<mapit.Marker[]>([]);
  const [menu, setMenu] = useState<mapit.menu>("style");
  const [options, setOptions] = useImmer<google.maps.MapOptions>({
    zoom: 2,
    center: { lat: 0, lng: 30.00000000000001 },
    styles: [],
  });
  const getOptions = () => ({
    zoom: options.zoom,
    zoomControl: false,
    center: options.center,
    minZoom: 2,
    maxZoom: 16,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    zoomControlOptions: {
      position: 9,
    },
    styles: options.styles,
  });

  const optionsMemo = useMemo<google.maps.MapOptions>(() => {
    const options = getOptions();
    console.log(options);
    return options;
  }, [options.zoom, options.center, options.styles, getOptions]);

  const [staticURL, setStaticURL] = useImmer<Props>({
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    scale: 2,
    zoom: 2,
    center: "0,30",
    size: "1000x800",
    format: "png",
    maptype: "roadmap",
    markers: [],
    paths: [],
    style: "",
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
          staticURL={staticURL}
          setStaticURL={setStaticURL}
          optionsMemo={optionsMemo}
        />
        <Map
          options={options}
          setOptions={setOptions}
          markers={markers}
          setMarkers={setMarkers}
          menu={menu}
          setMenu={setMenu}
          staticURL={staticURL}
          setStaticURL={setStaticURL}
          optionsMemo={optionsMemo}
        />
      </main>
    </>
  );
}
