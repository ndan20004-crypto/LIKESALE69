import React from 'react';
import { MessageCircle, Send, Phone, Mail, Clock, MapPin } from 'lucide-react';
import { useSiteContent } from '../contexts/SiteContentContext';

export default function Contact() {
  const { content } = useSiteContent();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-white mb-2">{content.contact.pageTitle}</h1>
        <p className="text-slate-300">{content.contact.pageSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Methods */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 border border-blue-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <MessageCircle className="size-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl text-white">{content.contact.zaloTitle}</h3>
                <p className="text-slate-100">{content.contact.zaloSubtitle}</p>
              </div>
            </div>
            <a
              href={content.contact.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-white text-blue-600 text-center py-3 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {content.contact.zaloButtonText}
            </a>
            <p className="text-slate-100 text-center mt-3">{content.contact.zaloPhoneText}</p>
          </div>

          <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-lg p-6 border border-sky-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Send className="size-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl text-white">{content.contact.telegramTitle}</h3>
                <p className="text-slate-100">{content.contact.telegramSubtitle}</p>
              </div>
            </div>
            <a
              href={content.contact.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-white text-sky-600 text-center py-3 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {content.contact.telegramButtonText}
            </a>
            <p className="text-slate-100 text-center mt-3">{content.contact.telegramHandleText}</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="size-6 text-green-400" />
              <div>
                <h4 className="text-white">{content.contact.hotlineLabel}</h4>
                <p className="text-slate-400">{content.contact.hotlineValue}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="size-6 text-blue-400" />
              <div>
                <h4 className="text-white">{content.contact.emailLabel}</h4>
                <p className="text-slate-400">{content.contact.emailValue}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="size-6 text-purple-400" />
              <div>
                <h4 className="text-white">{content.contact.supportTimeLabel}</h4>
                <p className="text-slate-400">{content.contact.supportTimeValue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info and FAQ */}
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-2xl text-white mb-4">{content.contact.faqTitle}</h3>
            
            <div className="space-y-4">
              {content.contact.faqs.map((item, idx) => (
                <div key={idx}>
                  <h4 className="text-white mb-2">{item.q}</h4>
                  <p className="text-slate-400">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 border border-green-500">
            <h3 className="text-xl text-white mb-3">{content.contact.tipsTitle}</h3>
            <ul className="space-y-2 text-slate-100">
              {content.contact.tips.map((tip, idx) => (
                <li key={idx}>✓ {tip}</li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-xl text-white mb-3">{content.contact.companyTitle}</h3>
            <div className="space-y-2 text-slate-300">
              <p><strong className="text-white">{content.contact.companyNameLabel}</strong> {content.contact.companyNameValue}</p>
              <p><strong className="text-white">{content.contact.companyFieldLabel}</strong> {content.contact.companyFieldValue}</p>
              <p><strong className="text-white">{content.contact.companyWebsiteLabel}</strong> {content.contact.companyWebsiteValue}</p>
              <p className="mt-4 text-slate-400 text-sm">
                {content.contact.companyDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
