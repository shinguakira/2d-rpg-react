interface Window {
  ENV?: {
    REMIX_PUBLIC_DEBUG_MODE?: string;
    [key: string]: string | undefined;
  };
}
