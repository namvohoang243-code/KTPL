/** Domain types — shared by data, engine, services and UI. */

/** RIASEC / Holland codes. Add a new letter here + in data/personalities.ts to extend the system. */
export type PersonalityCode = 'R' | 'I' | 'A' | 'S' | 'E' | 'C'

export type ScoreMap = Record<PersonalityCode, number>

export interface Personality {
  code: PersonalityCode
  /** English label, e.g. "Investigative" */
  name: string
  /** Vietnamese nickname, e.g. "Người khám phá" */
  title: string
  tagline: string
  description: string
  /** Short adjective traits (English, used in "Top traits") */
  traits: string[]
  strengths: string[]
  environments: string[]
  examples: string[]
  /** One-liner describing what this group adds when it is a secondary / supporting group */
  support: string
  /** Pool of strength insights; the result page samples from it based on the user's scores */
  insights: StrengthInsight[]
  /** Chart / badge colour */
  color: string
  /** lucide-react icon key, resolved in components/shared/icons.ts */
  icon: string
}

export interface StrengthInsight {
  icon: string
  title: string
  text: string
}

export interface QuestionOption {
  text: string
  score: number
  code?: PersonalityCode
}

export interface Question {
  id: string
  code: PersonalityCode
  number: number
  text: string
  groupTitle?: string
  groupTagline?: string
  options?: QuestionOption[]
}

export interface CareerCluster {
  id: string
  /** Vietnamese full name */
  name: string
  /** Short label used in charts & the class dashboard */
  shortLabel: string
  description: string
  /** Holland code, most important letter first */
  code: PersonalityCode[]
  icon: string
}

export interface Occupation {
  id: string
  name: string
  clusterId: string
  description: string
  code: PersonalityCode[]
  skills: string[]
  environments: string[]
}

export interface QuizResult {
  name?: string
  className?: string
  scores: ScoreMap
  rawScores?: ScoreMap
  answers?: Record<string, number>
  /** Letters sorted by score, e.g. ['I','R','C'] */
  topCodes: PersonalityCode[]
  /** e.g. "I-R-C" */
  topType: string
  primaryCareer?: string
  takenAt: string
  formSubmitted?: 'pending' | 'success' | 'failed' | 'idle'
}

export interface Student {
  /** Anonymous id, e.g. "ST01" */
  id: string
  nickname?: string
  name?: string
  className?: string
  personality: ScoreMap
  rawScores?: ScoreMap
  topType: string
  /** Career cluster ids; the first one is the primary interest */
  careers: string[]
  primaryCareerName?: string
  demo?: boolean
  submittedAt?: string
}

export interface GoogleFormConfig {
  formUrl: string
  entries: {
    name: string
    cls: string
    group: string
    code: string
    R: string
    I: string
    A: string
    S: string
    E: string
    C: string
    career: string
  }
  sheetCsvUrl: string
  classSize: number
  showNames: boolean
}

export interface CareerMatch<T> {
  item: T
  /** 0 – 100 */
  compatibility: number
}
