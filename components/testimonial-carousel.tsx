"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah L.",
    avatar: "/placeholder.svg?width=40&height=40&text=SL",
    text: "Loka est fantastique ! J'ai loué un nettoyeur haute pression pour le week-end et j'ai économisé tellement d'argent. Le processus était simple et le propriétaire super sympa.",
    rating: 5,
  },
  {
    name: "Mike P.",
    avatar: "/placeholder.svg?width=40&height=40&text=MP",
    text: "J'ai listé quelques-uns de mes outils rarement utilisés sur Loka et j'ai gagné un peu d'argent. C'est génial de voir mes outils être utiles au lieu de prendre la poussière !",
    rating: 5,
  },
  {
    name: "Jessica B.",
    avatar: "/placeholder.svg?width=40&height=40&text=JB",
    text: "J'avais besoin d'un outil de jardinage spécifique pour un projet ponctuel. Je l'ai trouvé sur Loka dans mon quartier. Tellement pratique et écologique !",
    rating: 4,
  },
  {
    name: "David K.",
    avatar: "/placeholder.svg?width=40&height=40&text=DK",
    text: "La plateforme est facile à utiliser et j'adore le concept de partage au sein de la communauté. Je recommande vivement Loka pour louer et lister des articles.",
    rating: 5,
  },
]

export default function TestimonialCarousel() {
  return (
    <section className="py-16 bg-muted/40">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Apprécié par notre communauté</h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="h-full flex flex-col justify-between shadow-lg rounded-xl">
                    <CardContent className="flex flex-col items-center justify-center text-center p-6 space-y-4">
                      <Avatar className="h-16 w-16 mb-2">
                        <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <p className="font-semibold text-lg">{testimonial.name}</p>
                      <div className="flex">
                        {Array(testimonial.rating)
                          .fill(0)
                          .map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                          ))}
                        {Array(5 - testimonial.rating)
                          .fill(0)
                          .map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-yellow-400" />
                          ))}
                      </div>
                      <p className="text-sm text-muted-foreground italic">"{testimonial.text}"</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  )
}
