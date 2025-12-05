import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, MessageCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Navigation',
      links: [
        { name: 'Accueil', href: '/' },
        { name: 'Livraisons', href: '/deliveries' },
        { name: 'Tarifs', href: '/pricing' },
        { name: 'À propos', href: '/about' },
      ],
    },
    {
      title: 'Légal',
      links: [
        { name: 'Mentions légales', href: '/legal' },
        { name: 'Politique de confidentialité', href: '/privacy' },
        { name: 'CGU', href: '/terms' },
        { name: 'CGV', href: '/terms-sale' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Centre d\'aide', href: '/help' },
        { name: 'Contact', href: '/contact' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Statut', href: '/status' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: <Facebook className="h-5 w-5" />, href: '#' },
    { name: 'Twitter', icon: <Twitter className="h-5 w-5" />, href: '#' },
    { name: 'Instagram', icon: <Instagram className="h-5 w-5" />, href: '#' },
    { name: 'LinkedIn', icon: <Linkedin className="h-5 w-5" />, href: '#' },
  ];

  const contactInfo = [
    { icon: <Mail className="h-5 w-5 text-muted-foreground" />, text: 'contact@delivery-ops.com' },
    { icon: <Phone className="h-5 w-5 text-muted-foreground" />, text: '+33 1 23 45 67 89' },
    { icon: <MapPin className="h-5 w-5 text-muted-foreground" />, text: '123 Rue de la Livraison, 75000 Paris' },
  ];

  return (
    <footer className="w-full bg-background border-t">
      <div className="container px-4 py-12 mx-auto">
        {/* Newsletter */}
        <div className="mb-12 max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Restez informé</h3>
          <p className="text-muted-foreground mb-6">
            Inscrivez-vous à notre newsletter pour recevoir les dernières actualités et offres spéciales.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Votre adresse email" 
              className="flex-1" 
              required 
            />
            <Button type="submit" className="whitespace-nowrap">
              S'inscrire
            </Button>
          </form>
        </div>

        <Separator className="my-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Delivery Ops</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Votre partenaire de confiance pour des livraisons rapides et efficaces.
              Nous nous engageons à fournir un service de qualité à chaque étape.
            </p>
            
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Liens de navigation */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="mt-0.5">{item.icon}</span>
                  <span className="text-sm text-muted-foreground">{item.text}</span>
                </li>
              ))}
              <li className="flex items-start space-x-3 pt-2">
                <MessageCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Support WhatsApp :</p>
                  <a
                    href="https://wa.me/237658852731?text=Bonjour%2C%20j%27ai%20une%20question%20sur%20Delivery%20Ops"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    +237 658 852 731
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Delivery Ops. Tous droits réservés.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Confidentialité
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Conditions d'utilisation
            </Link>
            <Link to="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
