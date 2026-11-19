// Memetakan nama ikon (string dari data/backend) ke komponen lucide-react.
import {
  TreePine, Fish, PawPrint, Wheat, Banknote, Route, Utensils, CalendarDays, Users, Droplets,
  Landmark, Store, Sprout, Ruler, Phone, Navigation, Image as ImageIcon, MapPin, Mail, HelpCircle,
} from "lucide-react";

const ICONS = {
  trees: TreePine, fish: Fish, paw: PawPrint, wheat: Wheat, banknote: Banknote, route: Route,
  utensils: Utensils, calendar: CalendarDays, users: Users, droplets: Droplets, landmark: Landmark,
  store: Store, sprout: Sprout, ruler: Ruler, phone: Phone, navigation: Navigation, image: ImageIcon,
  pin: MapPin, mail: Mail,
};

export const getIcon = (name) => ICONS[name] || HelpCircle;
