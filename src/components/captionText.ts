// On-screen captions keep only the shadda; full tashkeel stays in the voice script.
export const stripHarakat = (s: string) => s.replace(/[ً-ِْ]/g, '');
