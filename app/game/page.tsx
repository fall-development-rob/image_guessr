"use client";

import SelectBlock from "@/components/form/select";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { BarLoader } from "react-spinners";
import { usePathname, useSearchParams } from "next/navigation";
import ImageForm from "@/components/form/ImageForm";
import { postImageGeneration, fetchImageResult } from "../api/ImageHandler";

const subjectOptions = [
  { title: "duck", value: "duck" },
  { title: "dog", value: "dog" },
  { title: "tractor", value: "tractor" },
  { title: "banana", value: "banana" },
];
const locationOptions = [
  { title: "the sky", value: "the sky" },
  { title: "a bath", value: "a bath" },
  { title: "the desert", value: "the desert" },
  { title: "the ocean", value: "the ocean" },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type ImageResult = {
  id: string;
  status: "completed" | "error" | "waiting" | "processing";
  image_url?: string;
};

export default function Game() {
  const [subject, setSubject] = useState<string>("duck");
  const [location, setLocation] = useState<string>("the sky");
  const [imageResult, setImageResult] = useState<ImageResult | null>();
  const [error, setError] = useState<string | null>();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [role, setRole] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [guess, setGuess] = useState<boolean>(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  let gameID = null;

  if (pathname === "/game") {
    gameID = searchParams.get("id");
  }

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/game/ws2?id=${gameID}`);
    setWs(socket);

    socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.status === "failed") {
          setError(`An error occurred.`);
        }

        switch (data.type) {
          case "image_generation":
            setImageResult(data.img);
            setPrompt(data.prompt);
            break;
          case "role_allocation":
            setRole(data.role);

            break;
          // Handle other message types
          default:
            setError("Unknown message type");
        }
      } catch (error) {
        console.error("Error in parsing data:", error);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleSubmitGuess = async (e: React.FormEvent) => {
    e.preventDefault();

    let guessPrompt = `A photo of a ${subject} in ${location}`;

    if (guessPrompt === prompt) {
      setGuess(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imagePrompt = `A photo of a ${subject} in ${location}`;

    setPrompt(imagePrompt);

    try {
      let result = await postImageGeneration(imagePrompt);

      setImageResult(result);

      while (result.status !== "completed" && result.status !== "failed") {
        await sleep(6000);
        result = await fetchImageResult(result.id);
        setImageResult(result);
        sendImage(result);

        console.log(result);
      }

      sendImage(result);
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Error:", error);
    }
  };

  const sendImage = (result) => {
    console.log(prompt);
    try {
      ws?.send(
        JSON.stringify({
          type: "image_generation",
          status: result.status,
          img: result,
          prompt: prompt,
        })
      );
    } catch (error) {
      setError(`An error occurred.`);
      console.error("Error in sending data:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 m-auto">
      <div className="flex flex-none h-fit mx-auto text-sm uppercase gap-4 p-8">
        <div className="my-auto">You are the</div>
        <div className="border border-white rounded py-2 px-4">{role}</div>
      </div>
      {error && (
        <div className="flex flex-none h-fit mx-auto uppercase">
          <div className="mb-4 text-red-400 uppercase">{error}</div>
        </div>
      )}

      {guess && (
        <>
          {" "}
          {guess == true ? (
            <div className="flex flex-none h-fit mx-auto uppercase">
              <div className="mb-4 text-green-400 uppercase">
                SMASHED IT!!!!
              </div>
            </div>
          ) : (
            ""
          )}
        </>
      )}
      <div className="flex flex-1">
        <div className="flex mx-auto border border-white rounded border-opacity-50 aspect-square w-[80vw] max-w-[50vh]">
          {imageResult && (
            <>
              {imageResult.image_url ? (
                <div className="relative w-full">
                  <Image
                    src={imageResult.image_url}
                    alt="Generated image"
                    priority
                    fill
                  />
                </div>
              ) : (
                <div className="flex flex-col m-auto text-gray-400 p-4 gap-1">
                  <div className="mx-auto">
                    {imageResult.status.toUpperCase()}
                  </div>
                  <div>
                    <BarLoader color={"#ffffff"} loading={true} />
                  </div>
                </div>
              )}
            </>
          )}

          {!imageResult && (
            <div className="m-auto text-gray-400 p-4 text-center">
              Choose your prompt and generate!
            </div>
          )}
        </div>
      </div>
      <ImageForm
        subject={subject}
        location={location}
        onSubjectChange={setSubject}
        onLocationChange={setLocation}
        onSubmit={
          role && (role === "guesser" ? handleSubmitGuess : handleSubmit)
        }
        subjectOptions={subjectOptions}
        locationOptions={locationOptions}
        disabled={
          imageResult != null &&
          (imageResult.status == "processing" ||
            imageResult.status == "waiting")
        }
        buttonText={role && (role === "guesser" ? "Guess" : "Generate")}
      />
    </div>
  );
}
