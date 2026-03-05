export const difficulty_map:Record<string,string> = {
    'ext':'extrene',
    'hig':'high',
    'med':'medium',
    'low':'low'
}

export type difficulty_code = keyof typeof difficulty_map

export const getDifficultyLabel = (code: string) =>
  difficulty_map[code as difficulty_code] ?? code