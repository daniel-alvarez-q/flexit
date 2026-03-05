export const exercise_category_map:Record<string,string> = {
    'str':'strength',
    'car':'cardio',
    'flx':'flexibility',
    'res':'resistance',
    'oth':'other'
}

export type exercise_code = keyof typeof exercise_category_map

export const getCategoryLabel = (code:string|undefined)=>
    exercise_category_map[code as exercise_code] ?? code
