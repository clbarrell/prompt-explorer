import { Configuration, OpenAIApi } from "openai";
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import fetchAdapter from "@vespaiach/axios-fetch-adapter";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  baseOptions: {
    adapter: fetchAdapter,
  },
});
const openai = new OpenAIApi(configuration);

// TODO: Streaming https://vercel.com/blog/gpt-3-app-next-js-vercel-edge-functions#edge-functions-with-streaming

export const config = {
  runtime: "edge",
};

type Data = {
  prompt: string;
};

const handler = async (req: NextRequest): Promise<NextResponse> => {
  if (req.method !== "POST")
    return NextResponse.json(
      {
        error: {
          message: "Only POST requests are supported.",
        },
      },
      { status: 404 }
    );

  const timeStart = new Date();
  if (!configuration.apiKey) {
    return NextResponse.json(
      {
        error: {
          message:
            "OpenAI API key not configured, please follow instructions in README.md",
        },
      },
      { status: 500 }
    );
  }
  console.log("BODY:");
  // console.log(JSON.parse(req.body));
  const response = await req.json();
  console.log(response);
  const prompt = response?.prompt || "";

  if (prompt.trim().length === 0) {
    return NextResponse.json(
      {
        error: {
          message: "Please enter a valid prompt",
        },
      },
      { status: 400 }
    );
  }
  // console.log("Running");
  try {
    // const completion = await openai.createChatCompletion({
    // model: "gpt-3.5-turbo",
    // messages: [
    //   {
    //     content: "You are a friendly, intelligent AI assistant.",
    //     role: "system",
    //   },
    //   {
    //     content: prompt,
    //     role: "user",
    //   },
    // ],
    // });
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            content: "You are a friendly, intelligent AI assistant.",
            role: "system",
          },
          {
            content: prompt,
            role: "user",
          },
        ],
      }),
    });
    const completion = await response.json();

    // SUCCESS;
    // console.log("Response", completion.choices[0].message?.content);
    // res
    //   .status(200)
    //   .json({ result: completion.choices[0].message?.content });
    console.log(
      "Completed: seconds",
      (new Date().getTime() - timeStart.getTime()) / 1000
    );
    return NextResponse.json(
      {
        result: completion.choices[0].message?.content,
      },
      { status: 200 }
    );
  } catch (error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      // res.status(error.response.status).json(error.response.data);
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      // res.status(500).json({
      //   error: {
      //     message: "An error occurred during your request.",
      //   },
      // });
      return NextResponse.json(
        {
          error: {
            message: "An error occurred during your request.",
          },
        },
        { status: 500 }
      );
    }
  }
};

export default handler;
