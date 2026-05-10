export type Role = 'musician' | 'venue'

export interface Profile {
  id: string
  role: Role
  first_name: string | null
  last_name: string | null
  act_name: string | null
  county: string | null
  bio: string | null
  rate: string | null
  avatar_url: string | null
  genre: string[] | null
  travel_counties: string[] | null
  available_dates: string[] | null
  media_links: string[] | null
  instagram: string | null
  facebook: string | null
  youtube: string | null
  spotify: string | null
  website: string | null
  created_at: string
}

export interface Gig {
  id: string
  musician_id: string
  venue_name: string
  location: string | null
  gig_date: string
  start_time: string | null
  description: string | null
  ticket_url: string | null
  created_at: string
}

export interface Review {
  id: string
  musician_id: string
  venue_name: string | null
  reviewer_name: string
  rating: number
  body: string
  created_at: string
}

export interface Conversation {
  id: string
  participant_1: string
  participant_2: string
  created_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
}
