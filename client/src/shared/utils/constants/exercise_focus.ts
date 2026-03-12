export const exercise_focus_map:Record<string,string> = {
    'bac': 'back',
    'cht': 'chest',
    'arm': 'arms',
    'leg': 'legs',
    'shd': 'shoulder',
    'oth': 'other'
}

export type exercise_focus_code = keyof typeof exercise_focus_map

export const getFocusLabel = (code: string) =>
  exercise_focus_map[code as exercise_focus_code] ?? code