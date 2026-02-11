import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

interface ContactFormProps {
  userEmail?: string;
}

interface ContactFormContentProps {
  userEmail?: string;
  onClose?: () => void;
}

export const ContactFormContent: React.FC<ContactFormContentProps> = ({
  userEmail = "",
  onClose,
}) => {
  const [email, setEmail] = useState(userEmail);
  const [subjectType, setSubjectType] = useState("");
  const [itemName, setItemName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    setEmail(userEmail);
  }, [userEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Email 1: Confirmation à l'utilisateur
      const userTemplateParams = {
        user_email: email,
        subject_type: subjectType,
        item_name: itemName,
        to_email: email,
      };

      // Email 2: Notification à l'admin
      const adminTemplateParams = {
        user_email: email,
        subject_type: subjectType,
        item_name: itemName,
      };

      await Promise.all([
        emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          userTemplateParams,
        ),
        emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_NOTIFICATION_TEMPLATE_ID,
          adminTemplateParams,
        ),
      ]);

      setMessage({ type: "success", text: "Message sent successfully! 🎉" });
      setEmail(userEmail);
      setSubjectType("");
      setItemName("");

      setTimeout(() => {
        onClose?.();
        setMessage(null);
      }, 2000);
    } catch (error) {
      console.error("Error sending email:", error);
      setMessage({
        type: "error",
        text: "Failed to send message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = email && subjectType && itemName && !loading;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Your Email *</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">What are you looking for? *</Label>
        <Select value={subjectType} onValueChange={setSubjectType}>
          <SelectTrigger
            id="subject"
            className="bg-black/20 border-white/20 text-white"
          >
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent className="bg-black border-white/20 text-white">
            <SelectItem value="Could not find a movie">
              Could not find a movie
            </SelectItem>
            <SelectItem value="Could not find a tvshow">
              Could not find a TV show
            </SelectItem>
            <SelectItem value="Report a bug">Report a bug</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="itemName">
          {subjectType === "Could not find a movie"
            ? "Movie name"
            : subjectType === "Could not find a tvshow"
              ? "TV show name"
              : "Bug description"}{" "}
          *
        </Label>
        <Input
          id="itemName"
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder={
            subjectType === "Could not find a movie"
              ? "e.g., Inception"
              : subjectType === "Could not find a tvshow"
                ? "e.g., Breaking Bad"
                : "Tell The Dev what's wrong..."
          }
          required
        />
      </div>
      {message && (
        <div
          className={`p-3 rounded-md text-sm ${
            message.type === "success"
              ? "bg-green-500/20 text-green-400 border border-green-500/50"
              : "bg-red-500/20 text-red-400 border border-red-500/50"
          }`}
        >
          {message.text}
        </div>
      )}
      <Button
        type="submit"
        disabled={!canSubmit}
        className="w-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send"}
      </Button>
    </form>
  );
};

export const ContactForm: React.FC<ContactFormProps> = ({ userEmail = "" }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-gray-400 hover:text-white transition cursor-pointer bg-none border-none p-0 font-normal">
          Contact
        </button>
      </DialogTrigger>

      <DialogContent
        className="w-full max-w-lg md:max-w-md bg-black/40 backdrop-blur-md text-white border border-white/20"
        style={{ fontFamily: "'Metal Mania', serif" }}
      >
        <DialogHeader>
          <DialogTitle>Contact The Dev</DialogTitle>
          <DialogDescription className="text-gray-400">
            Let it know if you can't find a movie or TV show
          </DialogDescription>
        </DialogHeader>

        <ContactFormContent
          userEmail={userEmail}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
