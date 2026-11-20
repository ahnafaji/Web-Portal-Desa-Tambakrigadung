import {
  TreePine, Fish, PawPrint, Wheat, Banknote, Route, Utensils, CalendarDays, Users, Droplets,
  Landmark, Store, Sprout, Ruler, Phone, Navigation, Image as ImageIcon, MapPin, Mail, HelpCircle,
  Newspaper, RefreshCw, Star, Clock, User, Eye, Search, Tag, Megaphone, HardHat, HeartPulse, Camera,
  Award, ShieldCheck, Sparkles, ShoppingBag, Compass, Wrench, Coffee, Wallet, Headset, BookOpen,
} from "lucide-react";

const ICONS = {
  trees: TreePine, fish: Fish, paw: PawPrint, wheat: Wheat, banknote: Banknote, route: Route,
  utensils: Utensils, calendar: CalendarDays, users: Users, droplets: Droplets, landmark: Landmark,
  store: Store, sprout: Sprout, ruler: Ruler, phone: Phone, navigation: Navigation, image: ImageIcon,
  pin: MapPin, mail: Mail, newspaper: Newspaper, refresh: RefreshCw, star: Star, clock: Clock,
  user: User, eye: Eye, search: Search, tag: Tag, megaphone: Megaphone, hardhat: HardHat,
  heart: HeartPulse, camera: Camera, award: Award, shield: ShieldCheck, sparkles: Sparkles,
  bag: ShoppingBag, compass: Compass, wrench: Wrench, coffee: Coffee, wallet: Wallet,
  headset: Headset, book: BookOpen,
};

export const getIcon = (name) => ICONS[name] || HelpCircle;