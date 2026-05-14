import Link from 'next/link'
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const footerLinks = {
  loja: [
    { label: 'Catálogo', href: '/catalogo' },
    { label: 'Ofertas', href: '/ofertas' },
    { label: 'Novidades', href: '/novidades' },
    { label: 'Mais Vendidos', href: '/mais-vendidos' },
  ],
  institucional: [
    { label: 'Sobre Nós', href: '/sobre' },
    { label: 'Nossas Lojas', href: '/lojas' },
    { label: 'Trabalhe Conosco', href: '/carreiras' },
    { label: 'Blog', href: '/blog' },
  ],
  ajuda: [
    { label: 'Central de Ajuda', href: '/ajuda' },
    { label: 'Trocas e Devoluções', href: '/trocas' },
    { label: 'Formas de Pagamento', href: '/pagamento' },
    { label: 'Rastrear Pedido', href: '/rastrear' },
  ],
  legal: [
    { label: 'Termos de Uso', href: '/termos' },
    { label: 'Política de Privacidade', href: '/privacidade' },
    { label: 'Cookies', href: '/cookies' },
  ],
}

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Youtube, href: 'https://youtube.com', label: 'Youtube' },
]

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-2">Fique por dentro das novidades</h3>
            <p className="text-muted-foreground mb-6">
              Receba ofertas exclusivas e lançamentos em primeira mão
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 bg-secondary/50"
              />
              <Button type="submit" className="glow-primary">
                Inscrever-se
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="relative w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">P</span>
              </div>
              <span className="text-xl font-bold tracking-tight">
                Pragmatic<span className="text-primary">Tech</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Sua loja de tecnologia premium. Os melhores produtos com garantia e suporte especializado.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <a href="tel:+5511999999999" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="w-4 h-4" />
                (11) 99999-9999
              </a>
              <a href="mailto:contato@pragmatictech.com" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-4 h-4" />
                contato@pragmatictech.com
              </a>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Av. Paulista, 1000 - São Paulo, SP</span>
              </div>
            </div>
          </div>

          {/* Loja */}
          <div>
            <h4 className="font-semibold mb-4">Loja</h4>
            <ul className="space-y-3">
              {footerLinks.loja.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <h4 className="font-semibold mb-4">Institucional</h4>
            <ul className="space-y-3">
              {footerLinks.institucional.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ajuda */}
          <div>
            <h4 className="font-semibold mb-4">Ajuda</h4>
            <ul className="space-y-3">
              {footerLinks.ajuda.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {new Date().getFullYear()} PragmaticTech. Todos os direitos reservados.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
