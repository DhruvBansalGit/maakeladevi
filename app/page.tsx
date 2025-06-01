import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Eye, Layers, Award, Users, CheckCircle } from 'lucide-react';
export default function Home() {
  return (
   <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  Premium
                  <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                    Marble & Granite
                  </span>
                </h1>
                <p className="text-xl text-gray-300 mt-6 leading-relaxed">
                  Experience luxury stone surfaces like never before with our revolutionary 3D visualization technology. 
                  See how your chosen granite will look in your space before you buy.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/granites" 
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 
                           text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 
                           transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  Explore Collection
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="border-2 border-white/30 hover:border-white/50 text-white px-8 py-4 rounded-lg 
                                 font-semibold transition-all duration-300 backdrop-blur-sm hover:bg-white/10">
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>3D Visualization</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Premium Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Expert Installation</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/logo/banner.png"
                  alt="Premium Granite Showcase"
                  width={600}
                  height={400}
                  className="w-full h-96 object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
                    <p className="text-white font-semibold">360° Interactive View Available</p>
                    <p className="text-gray-200 text-sm">Experience our stones in immersive 3D</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Stone Collection?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine traditional craftsmanship with cutting-edge technology to deliver 
              an unparalleled stone selection experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl 
                          hover:shadow-xl transition-all duration-300 border border-blue-100">
              <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center mb-6 
                            group-hover:scale-110 transition-transform duration-300">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">3D Visualization</h3>
              <p className="text-gray-600 leading-relaxed">
                See exactly how your chosen granite will look with our revolutionary 3D viewer. 
                Rotate, zoom, and inspect every detail before making your decision.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl 
                          hover:shadow-xl transition-all duration-300 border border-amber-100">
              <div className="bg-amber-500 w-12 h-12 rounded-lg flex items-center justify-center mb-6 
                            group-hover:scale-110 transition-transform duration-300">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Premium Quality</h3>
              <p className="text-gray-600 leading-relaxed">
                Hand-selected stones from the finest quarries worldwide. Each slab undergoes 
                rigorous quality control to ensure perfection in every piece.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl 
                          hover:shadow-xl transition-all duration-300 border border-green-100">
              <div className="bg-green-500 w-12 h-12 rounded-lg flex items-center justify-center mb-6 
                            group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Expert Service</h3>
              <p className="text-gray-600 leading-relaxed">
                Our team of stone experts provides personalized consultation and professional 
                installation services to bring your vision to life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Granite Collection
            </h2>
            <p className="text-xl text-gray-600">
              Discover our most popular granite varieties, now with 3D preview
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Kashmir White",
                description: "Elegant white granite with subtle gray veining",
                image: "/images/granites/kashmir-white.jpg",
                price: "From ₹150/sq ft",
                popular: true
              },
              {
                name: "Black Galaxy",
                description: "Stunning black granite with golden speckles",
                image: "/images/granites/black-galaxy.jpg",
                price: "From ₹200/sq ft",
                popular: false
              },
              {
                name: "Tan Brown",
                description: "Warm brown granite with natural patterns",
                image: "/images/granites/tan-brown.jpg",
                price: "From ₹120/sq ft",
                popular: true
              }
            ].map((granite, index) => (
              <div key={index} className="group bg-white rounded-2xl overflow-hidden shadow-lg 
                                        hover:shadow-2xl transition-all duration-500 border border-gray-100">
                {granite.popular && (
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs 
                                font-bold px-3 py-1 absolute z-10 m-4 rounded-full">
                    POPULAR
                  </div>
                )}
                
                <div className="relative overflow-hidden">
                  <Image
                    src={granite.image}
                    alt={granite.name}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <button className="w-full bg-white/20 backdrop-blur-md text-white py-2 px-4 
                                       rounded-lg font-semibold flex items-center justify-center gap-2 
                                       hover:bg-white/30 transition-colors">
                        <Layers className="w-4 h-4" />
                        View in 3D
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{granite.name}</h3>
                  <p className="text-gray-600 mb-4">{granite.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-amber-600">{granite.price}</span>
                    <Link 
                      href={`/granites/${index + 1}`}
                      className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 
                               transition-colors group-hover:translate-x-1 duration-300"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/granites"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                       text-white px-8 py-4 rounded-lg font-semibold inline-flex items-center gap-2 
                       transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              View Complete Collection
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Our 3D Experience Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to visualize your perfect granite selection
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Browse Collection",
                description: "Explore our extensive granite catalog with high-quality images and detailed specifications"
              },
              {
                step: "02", 
                title: "Select Favorites",
                description: "Choose multiple granite options that catch your eye for detailed comparison"
              },
              {
                step: "03",
                title: "View in 3D",
                description: "Experience each granite in our immersive 3D viewer with realistic lighting and textures"
              },
              {
                step: "04",
                title: "Book Enquiry",
                description: "Request a quote and consultation for your selected granite with instant confirmation"
              }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full 
                                flex items-center justify-center mx-auto mb-4 group-hover:scale-110 
                                transition-transform duration-300 shadow-lg">
                    <span className="text-white font-bold text-lg">{item.step}</span>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 
                                  bg-gradient-to-r from-blue-200 to-gray-200 -translate-y-0.5"></div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Premium Granites" },
              { number: "10K+", label: "Happy Customers" },
              { number: "15+", label: "Years Experience" },
              { number: "100%", label: "Quality Guaranteed" }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="text-4xl lg:text-5xl font-bold text-amber-400 mb-2 
                              group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl mb-8 text-amber-100">
            Experience the future of granite selection with our 3D visualization technology. 
            Get started today and see the difference quality makes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/granites"
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 rounded-lg 
                       font-bold transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Start Exploring
            </Link>
            <Link 
              href="/contact"
              className="border-2 border-white/30 hover:border-white/50 text-white px-8 py-4 
                       rounded-lg font-semibold transition-all duration-300 backdrop-blur-sm 
                       hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
