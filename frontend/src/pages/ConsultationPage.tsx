import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE = `${import.meta.env.VITE_BASE_URL}/api`;

const ConsultationPage = () => {
  const [selectedService, setSelectedService] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [sessionPreference, setSessionPreference] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // enhanced modal state
  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<any | null>(null);
  const [modalProgress, setModalProgress] = useState<number>(100);

  // service fetching state
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);

  // Lists for services fetched from the API
  const [virtualServices, setVirtualServices] = useState<any[]>([]);
  const [inPersonServices, setInPersonServices] = useState<any[]>([]);

  const { toast } = useToast();

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    // basic validation
    if (!firstName || !lastName || !email || !phone) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phone,
        preferred_date: preferredDate || null,
        preferred_time: selectedTime || null,
        session_type: sessionPreference || null,
        selected_service: selectedService || null,
        notes: notes || null,
      };

      const res = await fetch(
        (`${API_BASE}/consultation`),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText || "Request failed");
      }

      const data = await res.json();
      // generate booking reference from server response or fallback
      const ref = data?.booking_ref ?? `BK-${Date.now().toString(36).toUpperCase().slice(-8)}`;
      const serviceName =
        selectedService &&
        [...virtualServices, ...inPersonServices].find((s) => s.id === selectedService)?.name;

      setBookingRef(ref);
      setBookingDetails({
        service: serviceName ?? selectedService ?? "N/A",
        date: preferredDate ?? "Not specified",
        time: selectedTime ?? "Not specified",
        type: sessionPreference ?? "Not specified",
      });

      setSuccessMessage("Booking confirmed — check details below.");
      setModalProgress(100);

      // Optionally clear form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setPreferredDate("");
      setSelectedTime("");
      setSessionPreference("");
      setNotes("");
      setSelectedService("");
    } catch (err: any) {
      setErrorMessage(err?.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    firstName &&
    lastName &&
    email &&
    phone &&
    preferredDate &&
    selectedTime &&
    sessionPreference;

  useEffect(() => {
    const getSession = async () => {
      setServicesLoading(true);
      setServicesError(null);
      try {
        const res = await fetch(`${API_BASE}/sessions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || res.statusText || "Request failed");
        }

        const data = await res.json();

        // Normalize sessionsList
        const sessionsList: any[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.sessions)
              ? data.sessions
              : [];

        if (!Array.isArray(sessionsList) || sessionsList.length === 0) {
          setServicesLoading(false);
          return;
        }

        // Normalize and split by type
        const virtual: any[] = [];
        const inperson: any[] = [];
        const freeItems: any[] = [];
        for (const item of sessionsList) {
          const t = (item.type || item.session_type || "").toString().toLowerCase();
          const isFree = t.includes("free");
          const normalized = {
            id: item.id ?? item.slug ?? item.name,
            name: item.name ?? item.title ?? "Session",
            duration: item.duration ?? item.length ?? item.time ?? "Varies",
            price: item.price ?? item.cost ?? item.rate ?? null,
            type: isFree
              ? "Virtual"
              : item.type ?? item.session_type ?? (t.includes("virtual") ? "Virtual" : "In-Person"),
            description: item.description ?? item.summary ?? "",
            features: Array.isArray(item.features) ? item.features : [],
          };

          if (isFree) freeItems.push(normalized);
          else if (t.includes("virtual")) virtual.push(normalized);
          else inperson.push(normalized);
        }

        if (freeItems.length || virtual.length) setVirtualServices([...freeItems, ...virtual]);
        if (inperson.length) setInPersonServices(inperson);
      } catch (err: any) {
        setServicesError(err?.message || "Failed to load sessions");
        console.error("sessions fetch error:", err);
      } finally {
        setServicesLoading(false);
      }
    };

    getSession();
  }, []);

  // Clear selectedService if it doesn't match the currently chosen sessionPreference
  useEffect(() => {
    if (!selectedService || !sessionPreference) return;
    const all = [...virtualServices, ...inPersonServices];
    const found = all.find((s) => s.id === selectedService);
    const type = (found?.type || "").toString().toLowerCase();
    const pref = sessionPreference.toString().toLowerCase();
    const prefMatches =
      pref.includes("virtual")
        ? type.includes("virtual")
        : type.includes("person") || type.includes("in-person") || type.includes("in person");
    if (!prefMatches) {
      setSelectedService("");
    }
  }, [sessionPreference, selectedService, virtualServices, inPersonServices]);

  const matchesPreference = (serviceType: string | undefined, pref: string) => {
    if (!pref) return true;
    const t = (serviceType || "").toString().toLowerCase();
    if (pref === "Virtual") return t.includes("virtual");
    return t.includes("person") || t.includes("in-person") || t.includes("in person");
  };

  // animate modal progress and auto-dismiss
  useEffect(() => {
    if (!successMessage) {
      setModalProgress(100);
      return;
    }
    const totalMs = 5000;
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - Math.round((elapsed / totalMs) * 100));
      setModalProgress(pct);
      if (elapsed >= totalMs) {
        clearInterval(id);
        setSuccessMessage(null);
        setBookingRef(null);
        setBookingDetails(null);
      }
    }, 100);
    return () => clearInterval(id);
  }, [successMessage]);

  return (
    <div className="min-h-screen py-8 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Book Your Consultation
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take the first step towards improved well-being. Schedule a
            personalized holistic therapy session with Dr. Ani to discuss your
            goals and develop a treatment plan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Service Selection */}
          <div className="space-y-8">
            {servicesLoading && (
              <div className="text-sm text-muted-foreground">Loading services...</div>
            )}
            {servicesError && (
              <div className="text-sm text-destructive">{servicesError}</div>
            )}

            {/* Virtual Sessions */}
            <div data-aos="fade-up" data-aos-delay="100">
              <div className="flex items-center gap-3 mb-6">
                <Video className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">
                  Virtual Consultations
                </h2>
              </div>
              <div className="grid gap-4">
                {virtualServices.map((service: any) => {
                  const isAllowed = matchesPreference(service.type, sessionPreference);
                  return (
                    <Card
                      key={service.id}
                      aria-disabled={!isAllowed}
                      className={`transition-all duration-300 ${
                        selectedService === service.id
                          ? "ring-2 ring-primary border-primary"
                          : "hover:shadow-md"
                      } ${!isAllowed ? "opacity-60 pointer-events-none cursor-not-allowed" : "cursor-pointer"}`}
                      onClick={() => {
                        if (!isAllowed) return;
                        setSelectedService(service.id);
                      }}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{service.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <Clock className="w-4 h-4" />
                              {service.duration}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {`$${Number(service.price)}`}
                            </div>
                            <div className="text-sm text-muted-foreground">per session</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{service.description}</p>
                        <div className="space-y-2">
                          {(service.features || []).map((feature: any, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-accent" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* In-Person Sessions */}
            <div data-aos="fade-up" data-aos-delay="200">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-semibold text-foreground">In-Person Consultations</h2>
              </div>
              <div className="grid gap-4">
                {inPersonServices.map((service: any) => {
                  const isAllowed = matchesPreference(service.type, sessionPreference);
                  return (
                    <Card
                      key={service.id}
                      aria-disabled={!isAllowed}
                      className={`transition-all duration-300 ${
                        selectedService === service.id ? "ring-2 ring-primary border-primary" : "hover:shadow-md"
                      } ${!isAllowed ? "opacity-60 pointer-events-none cursor-not-allowed" : "cursor-pointer"}`}
                      onClick={() => {
                        if (!isAllowed) return;
                        setSelectedService(service.id);
                      }}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{service.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <Clock className="w-4 h-4" />
                              {service.duration}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="text-primary border-primary">
                              {service?.price
                                ? `$${(service.price)}`
                                : "Upon Consultation"}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{service.description}</p>
                        <div className="space-y-2">
                          {(service.features || []).map((feature: any, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-accent" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Why Book With Dr. Ani */}
            <Card className="bg-secondary/50" data-aos="fade-up" data-aos-delay="300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent" />
                  Why Book With Dr. Liz Ani, PhD, MOT, OTR/L?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm font-medium text-foreground mb-4">
                  Dr. Liz Ani, PhD
                  <br />
                  <span className="text-xs text-muted-foreground">
                    PhD – Doctor of Philosophy in Education | MOT, OTR/L
                  </span>
                </p>
                <div className="space-y-3">
                  <div className="lg:flex items-start gap-3">
                    <Badge className="bg-accent text-accent-foreground">
                      Award Winner
                    </Badge>
                    <div>
                      <h4 className="font-medium">Top Professional Recognition</h4>
                      <p className="text-sm text-muted-foreground">
                        Who's Who Recognition and professional awards
                      </p>
                    </div>
                  </div>
                  <div className="lg:flex items-start gap-3">
                    <Badge className="bg-accent text-accent-foreground">Expert</Badge>
                    <div>
                      <h4 className="font-medium">10+ Years Experience</h4>
                      <p className="text-sm text-muted-foreground">
                        Specialized in sensory processing and TBI therapy
                      </p>
                    </div>
                  </div>
                  <div className="lg:flex items-start gap-3">
                    <Badge className="bg-primary text-primary-foreground">Licensed</Badge>
                    <div>
                      <h4 className="font-medium">Illinois Licensed OT</h4>
                      <p className="text-sm text-muted-foreground">
                        State-licensed occupational therapist
                      </p>
                    </div>
                  </div>
                  <div className="lg:flex items-start gap-3">
                    <Badge className="bg-accent/10 text-accent">Flexible</Badge>
                    <div>
                      <h4 className="font-medium">Virtual & In-Person Options</h4>
                      <p className="text-sm text-muted-foreground">
                        Choose what works best for your family
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="space-y-8 sticky top-32 self-start" data-aos="fade-left">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Your Session</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll contact you to confirm your
                  appointment.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form className="space-y-6" onSubmit={submitForm}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        First Name *
                      </label>
                      <Input
                        placeholder="Your first name"
                        required
                        value={firstName}
                        onChange={(e: any) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Last Name *
                      </label>
                      <Input
                        placeholder="Your last name"
                        required
                        value={lastName}
                        onChange={(e: any) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={email}
                      onChange={(e: any) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      placeholder="(555) 123-4567"
                      required
                      value={phone}
                      onChange={(e: any) => setPhone(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Preferred Date
                    </label>
                    <Input
                      type="date"
                      value={preferredDate}
                      onChange={(e: any) => setPreferredDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Preferred Time
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((time) => (
                        <Badge
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          className={`cursor-pointer text-center py-2 transition-colors ${
                            selectedTime === time
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-primary/10"
                          }`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Session Type Preference
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={sessionPreference === "Virtual" ? "default" : "outline"}
                        className={`cursor-pointer hover:bg-primary/10 ${
                          sessionPreference === "Virtual"
                            ? "bg-primary text-primary-foreground"
                            : ""
                        }`}
                        onClick={() => setSessionPreference("Virtual")}
                      >
                        <Video className="w-3 h-3 mr-1" />
                        Virtual
                      </Badge>
                      <Badge
                        variant={sessionPreference === "In-Person" ? "default" : "outline"}
                        className={`cursor-pointer hover:bg-primary/10 ${
                          sessionPreference === "In-Person"
                            ? "bg-primary text-primary-foreground"
                            : ""
                        }`}
                        onClick={() => setSessionPreference("In-Person")}
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        In-Person
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Tell us about your needs
                    </label>
                    <Textarea
                      placeholder="Please describe what you're hoping to achieve through therapy, any specific challenges, or questions you have..."
                      rows={4}
                      value={notes}
                      onChange={(e: any) => setNotes(e.target.value)}
                    />
                  </div>

                  {errorMessage && (
                    <div className="text-sm text-destructive">There was an error submitting the form.</div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="btn-hero w-full"
                    disabled={loading || !isFormValid}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    {loading ? "Submitting..." : "Request Consultation"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card data-aos="fade-up" data-aos-delay="400">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium">Response Time</h4>
                    <p className="text-sm text-muted-foreground">Within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium">Business Hours</h4>
                    <p className="text-sm text-muted-foreground">Mon-Fri, 9AM-5PM CT</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Enhanced success confirmation modal */}
      {successMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSuccessMessage(null)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden"
          >
            <div className="p-6 flex gap-4 items-start">
              <div className="flex-shrink-0">
                <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">Booking Confirmed</h3>
                <p className="text-sm text-muted-foreground mt-1">{successMessage}</p>

                {bookingRef && (
                  <div className="mt-3 flex items-center gap-3">
                    <div className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                      Ref: {bookingRef}
                    </div>
                    <button
                      className="text-xs text-primary underline"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(bookingRef);
                        } catch {
                          // ignore
                        }
                      }}
                    >
                      Copy
                    </button>
                  </div>
                )}

                {bookingDetails && (
                  <ul className="mt-4 text-sm space-y-1 text-muted-foreground">
                    <li>
                      <strong className="text-foreground">Service:</strong>{" "}
                      {bookingDetails.service}
                    </li>
                    <li>
                      <strong className="text-foreground">Type:</strong>{" "}
                      {bookingDetails.type}
                    </li>
                    <li>
                      <strong className="text-foreground">When:</strong>{" "}
                      {bookingDetails.date} • {bookingDetails.time}
                    </li>
                  </ul>
                )}
              </div>
            </div>

            {/* progress / actions */}
            <div className="border-t border-slate-100 dark:border-slate-800 px-6 py-3 bg-slate-50 dark:bg-transparent">
              <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded overflow-hidden">
                <div
                  style={{ width: `${modalProgress}%` }}
                  className="h-full bg-green-500 transition-all"
                />
              </div>

              <div className="mt-3 flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSuccessMessage(null);
                    setBookingRef(null);
                    setBookingDetails(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationPage;
