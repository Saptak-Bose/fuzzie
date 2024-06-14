import { create } from "zustand";

export type Option = {
  value: string;
  label: string;
  disable?: boolean;
  fixed?: boolean;
  [key: string]: string | boolean | undefined;
};

type FuzzieStore = {
  googleFile: any;
  setGoogleFile: (googleFile: any) => void;
  slackChannels: Option[];
  setSlackChannels: (slackChannels: Option[]) => void;
  selectedSlackChannels: Option[];
  setSelectedSlackChannels: (selectedSlackChannels: Option[]) => void;
};

export const useFuzzieStore = create<FuzzieStore>()((set) => ({
  googleFile: {},
  setGoogleFile: (googleFile: any) => set({ googleFile }),
  slackChannels: [],
  setSlackChannels: (slackChannels: Option[]) => set({ slackChannels }),
  selectedSlackChannels: [],
  setSelectedSlackChannels: (selectedSlackChannels: Option[]) =>
    set({ selectedSlackChannels }),
}));
