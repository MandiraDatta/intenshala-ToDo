import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend | null = null;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey && apiKey !== 're_123456789') {
      this.resend = new Resend(apiKey);
    } else {
      this.logger.warn('RESEND_API_KEY is not configured. Email sending will be logged to console.');
    }
  }

  async sendWorkspaceInvite(params: {
    toEmail: string;
    inviterName: string;
    workspaceName: string;
    projectName?: string;
    inviteLink: string;
  }): Promise<{ success: boolean; data?: any; error?: any }> {
    const { toEmail, inviterName, workspaceName, projectName, inviteLink } = params;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    const entityName = projectName ? `project ${projectName} (in ${workspaceName})` : `workspace ${workspaceName}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; rounded-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #171717; margin-bottom: 16px;">You've been invited to join ${projectName ? projectName : workspaceName}!</h2>
        <p style="color: #525252; font-size: 14px; line-height: 1.5;">
          <strong>${inviterName}</strong> has invited you to collaborate on <strong>${entityName}</strong> in Pyramid Task & Project Management.
        </p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${inviteLink}" style="background-color: #171717; color: #ffffff; padding: 12px 24px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 8px; display: inline-block;">
            Accept Invitation
          </a>
        </div>
        <p style="color: #737373; font-size: 12px; line-height: 1.4;">
          If button doesn't work, copy and paste this link into your browser:<br/>
          <a href="${inviteLink}" style="color: #2563eb;">${inviteLink}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
        <p style="color: #a3a3a3; font-size: 11px; text-align: center;">
          Pyramid Task & Project Management • Powered by Resend
        </p>
      </div>
    `;

    this.logger.log(`[INVITE EMAIL] Sending invite to ${toEmail} for ${entityName} (Link: ${inviteLink})`);

    if (!this.resend) {
      this.logger.warn(`Resend client not initialized. Simulated email delivery to ${toEmail}`);
      return { success: true, data: { id: 'simulated-resend-id' } };
    }

    try {
      const data = await this.resend.emails.send({
        from: fromEmail,
        to: [toEmail],
        subject: `Invitation to join ${projectName ? projectName : workspaceName} on Pyramid`,
        html: htmlContent,
      });

      this.logger.log(`Resend Email sent successfully to ${toEmail}: ${JSON.stringify(data)}`);
      return { success: true, data };
    } catch (error) {
      this.logger.error(`Failed to send email via Resend to ${toEmail}:`, error);
      return { success: false, error };
    }
  }
}
