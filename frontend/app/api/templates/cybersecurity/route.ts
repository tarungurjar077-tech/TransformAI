import { NextResponse } from "next/server";

const SAMPLE_CYBERSECURITY_REPORT = `INCIDENT POST-MORTEM & TECHNICAL INVESTIGATION REPORT
INCIDENT IDENTIFIER: INC-2026-APEX-8841
CLASSIFICATION: TLP:AMBER | CRITICAL INFRASTRUCTURE INCIDENT
DATE OF DETECTION: March 14, 2026 - 02:47:11 UTC
ORGANIZATION: ApexCloud Global Financial Infrastructure & Payment Gateway

1. EXECUTIVE EXECUTIVE SUMMARY
At 02:47 UTC on March 14, 2026, the ApexCloud Security Operations Center (SOC) identified anomalous telemetry originating from an internal authentication microservice (auth-gateway-prod-04). Subsequent investigation confirmed that an advanced persistent threat group gained unauthorized access by exploiting a zero-day vulnerability in a legacy third-party cryptographic library (CVE-2026-30114, CVSS 9.8). 

The threat actor compromised service account credentials, escalated privileges across the AWS GovCloud production VPC, and staged approximately 1.4 TB of encrypted transaction metadata and customer API audit logs. No customer master payment encryption keys (HSMs) or plaintext financial records were exfiltrated. Immediate containment was enacted at 04:12 UTC, and full perimeter isolation was achieved within 85 minutes of detection.

2. TIMELINE OF KEY EVENTS (ALL TIMES UTC)
- 2026-03-14 01:15:02 — Threat actor scans perimeter API endpoints using distributed residential proxies.
- 2026-03-14 01:52:40 — Zero-day memory-corruption payload deployed against auth-gateway-prod-04:8443.
- 2026-03-14 02:18:19 — Secondary payload deployed; unauthorized lateral movement via Kerberos ticket forgery (Silver Ticket attack).
- 2026-03-14 02:47:11 — SIEM generates automated High Severity Alert (Deviation in service account svc_data_sync egress).
- 2026-03-14 03:05:00 — CSIRT incident commander declares Level-1 Critical Incident.
- 2026-03-14 03:45:30 — Malicious command-and-control (C2) domain sync-telemetry-cdn.net sinkholed via Cloudflare DNS.
- 2026-03-14 04:12:00 — Revocation of all active OAuth refresh tokens and temporary rotation of IAM credentials across production clusters.
- 2026-03-14 05:30:00 — Perimeter secured, forensic memory snapshots captured, zero unauthorized egress observed.

3. IMPACT ASSESSMENT & COMPROMISED ASSETS
- Affected Core Services: auth-gateway-prod-04, billing-sync-worker-02, and regional audit logging bucket s3://apex-audit-logs-eu-west-1.
- Total Impacted Records: ~420,000 hashed transaction identifiers and metadata records.
- Financial Loss Direct: $0 unauthorized fund transfers; estimated containment and remediation cost: $1.2M USD.
- Regulatory Notifications: CERT-In, CISA, and GDPR Data Protection Commissioners notified within 72-hour mandatory disclosure window.

4. INDICATORS OF COMPROMISE (IoCs)
- Malicious C2 IP Addresses:
  * 185.220.101.44 (Rotterdam, Netherlands)
  * 91.240.118.172 (Sofia, Bulgaria)
- Associated Malicious Domains:
  * update-apexcloud-internal.com
  * sync-telemetry-cdn.net
- Binary SHA-256 Hashes:
  * e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 (Backdoor dropper)
  * 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069 (Memory scraping tool)

5. IMMEDIATE REMEDIATION & ACTION ITEMS
1. Complete rebuild and redeployment of all perimeter API gateway container images with patched OpenSSL and zero-trust mutual TLS.
2. Enforce hardware-backed FIDO2 WebAuthn for all internal administrator and service account access.
3. Accelerate deployment of AI-driven egress behavioral monitoring across all AWS VPC peering links.
4. Schedule independent third-party penetration testing and source code verification for Q2 2026.`;

export async function GET() {
  return NextResponse.json({
    title: "ApexShield-2026: Critical Infrastructure Cybersecurity Incident",
    category: "Cybersecurity",
    recommended_outputs: [
      "executive_summary",
      "security_advisory",
      "social_media",
      "video_script",
      "presentation"
    ],
    content: SAMPLE_CYBERSECURITY_REPORT
  });
}
