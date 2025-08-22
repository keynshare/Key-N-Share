"use client";
import React, { useState } from "react";
import Header from "@/components/SpecificDatasetPage/Header";
import RequestSidebar from "./RequestSidebar";
import { Mails } from "lucide-react";
import MetaDataSection from "./MetaDataSection";
import DatasetData from "@/components/assets/dataset.json";
import { useParams } from "next/navigation";
import Breadcrumb from "../SharedComponents/Breadcrumb/Breadcrumb";

const features = [
  { key: "spotify_track_uri", label: "spotify_track_uri", description: "Unique identifier for each Spotify track" },
  { key: "ts", label: "ts", description: "Timestamp of the streaming event" },
  { key: "platform", label: "platform", description: "Platform used for streaming (e.g., iOS, Android, Web)" },
  { key: "ms_played", label: "ms_played", description: "Milliseconds the track was played" },
  { key: "track_name", label: "track_name", description: "Name of the track" },
  { key: "artist_name", label: "artist_name", description: "Name of the artist" },
  { key: "album_name", label: "album_name", description: "Name of the album" },
  { key: "reason_start", label: "reason_start", description: "Reason for starting the track (e.g., click, play_button)" },
  { key: "reason_end", label: "reason_end", description: "Reason for ending the track (e.g., endplay, trackdone)" },
  { key: "shuffle", label: "shuffle", description: "Whether shuffle was enabled" },
  { key: "skipped", label: "skipped", description: "Whether the track was skipped" },
];

export default function SpecificDatasetPage() {
  const { id } = useParams(); 
  const Paramid = Number(id);

  const Data = DatasetData.find((item) => item.id === Paramid);

  const [ShowRequest, setShowRequest] = useState(false);

  return (
    <>
    <div className="flex flex-col px-3 md:px-10 xl:px-16 2xl:px-20 gap-5">
    <Breadcrumb items={[{ label: "Catalogue", href: "/catalogue" }, { label: Data?.Title, isActive: true }]} />
    <div className=" grid grid-cols-4  gap-1  pb-8 ">
      <div className="col-span-full lg:col-span-3 lg:pr-5 xl:pr-10">
        <Header Title={Data?.Title} Extention={Data?.Type} Price={Data?.Price} Tags={Data?.Tags} CoverImage={Data?.Image} />
        <MetaDataSection
          features={features}
          About={Data?.Description}
          Source={Data?.Description}
        />
      </div>

      <RequestSidebar ShowRequest={ShowRequest} />

      <button
        onClick={() => setShowRequest(!ShowRequest)}
        className="fixed text-white lg:hidden bottom-10 right-8 bg-orange-400 p-4 rounded-full z-50"
      >
        <Mails />
      </button>
    </div>
    </div>
    </>
  );
}
