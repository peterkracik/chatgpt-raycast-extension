import { Detail, getPreferenceValues, LaunchProps } from "@raycast/api";
import { useEffect, useState } from "react";
import { Configuration, OpenAIApi } from "openai";


type Preferences = {
  openai_api_key: string;
  openai_model: string;
  openai_max_tokens: string;
  openai_temperature: string;
}

type CommandProps = {
  query: string
}
export default function Command(props: LaunchProps<{ arguments: CommandProps }>) {
  const { query } = props.arguments;
  const { openai_api_key, openai_model, openai_max_tokens, openai_temperature } = getPreferenceValues<Preferences>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [result, setResult] = useState<string|null>(null);

  const configuration = new Configuration({
    apiKey: openai_api_key,
  });
  const openai = new OpenAIApi(configuration);

  const callPromt = async (prompt: string) => {
    try {
      const completion = await openai.createCompletion({
        model: openai_model,
        prompt: prompt,
        n: 1,
        max_tokens: parseInt(openai_max_tokens),
        temperature: parseInt(openai_temperature),
        suffix: "in markdown format",
      });
      setResult(completion.data.choices[0].text as string);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      setResult(error.message);
    }
  }

  useEffect(() => {
    callPromt(query);
  }, [query])

  return <>
    {result && <Detail markdown={result} />}
    {isLoading && <Detail markdown="Loading..." />}
  </>
}

