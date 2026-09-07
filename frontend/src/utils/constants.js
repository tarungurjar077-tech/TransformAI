import {
  Briefcase,
  Share2,
  HelpCircle,
  FileText,
  Presentation,
  Mail
} from 'lucide-react';

export const ICON_MAP = {
  executive_summary: Briefcase,
  social_media: Share2,
  faq_study_guide: HelpCircle,
  blog_post: FileText,
  presentation_deck: Presentation,
  email_newsletter: Mail
};

export const TRANSFORMATION_ITEMS = [
  { id: 'executive_summary', label: 'Executive Summary', short: 'Exec Brief', badge: 'Leadership' },
  { id: 'social_media', label: 'Social Media Pack', short: 'Social Suite', badge: 'X & LinkedIn' },
  { id: 'faq_study_guide', label: 'FAQ & Study Guide', short: 'FAQ Guide', badge: 'Education' },
  { id: 'blog_post', label: 'Editorial Blog Post', short: 'Blog Article', badge: 'SEO' },
  { id: 'presentation_deck', label: 'Slide Deck Outline', short: 'Slide Deck', badge: 'Keynote' },
  { id: 'email_newsletter', label: 'Email Newsletter', short: 'Newsletter', badge: 'Campaign' }
];
