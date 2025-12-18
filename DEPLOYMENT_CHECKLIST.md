# GunaasoNepal - Deployment Checklist

## Pre-Deployment

### Database Setup
- [ ] Execute `supabase/schema.sql` in Supabase SQL Editor
- [ ] Verify all tables created successfully
- [ ] Create `evidence` storage bucket (public)
- [ ] Configure storage policies (see `supabase/setup-instructions.sql`)
- [ ] Verify RLS policies are enabled on all tables
- [ ] Test tracking ID generation function
- [ ] Verify default complaint categories are inserted (10 categories)
- [ ] Run `ANALYZE` on all tables for performance

### Environment Variables
- [ ] Copy `.env.example` to `.env.local`
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Set `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Set `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)
- [ ] Set `NEXT_PUBLIC_APP_URL` to production URL
- [ ] Configure optional email settings (if notifications enabled)

### Code Review
- [ ] Review all API routes for security issues
- [ ] Verify RLS policies match security requirements
- [ ] Check file upload size limits
- [ ] Ensure sensitive data is not logged
- [ ] Review error messages (no sensitive info leakage)
- [ ] Verify TypeScript types match database schema

### Testing
- [ ] Test anonymous complaint submission
- [ ] Test pseudonymous complaint submission
- [ ] Test verified complaint submission (with auth)
- [ ] Test file upload (all supported types)
- [ ] Test complaint tracking by tracking_id
- [ ] Test complaint listing with filters
- [ ] Test public projects API
- [ ] Test categories API
- [ ] Test statistics API
- [ ] Verify RLS policies block unauthorized access
- [ ] Test mobile responsiveness
- [ ] Test Nepali language support

## Deployment

### Vercel Deployment (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

### Manual Environment Variables (Vercel)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `NEXT_PUBLIC_APP_URL`

### Alternative: Self-Hosted
```bash
# Build application
npm run build

# Start production server
npm start
```

## Post-Deployment

### Verification
- [ ] Test complaint submission on production
- [ ] Test file upload on production
- [ ] Verify tracking links work correctly
- [ ] Check SSL certificate is valid
- [ ] Test from mobile devices
- [ ] Verify analytics tracking (if enabled)
- [ ] Test error tracking (Sentry, if configured)

### Performance
- [ ] Run Lighthouse audit (target: 90+ performance)
- [ ] Verify Core Web Vitals are in green
- [ ] Test page load times from Nepal
- [ ] Check image optimization
- [ ] Verify CDN configuration
- [ ] Monitor API response times

### Security
- [ ] Verify HTTPS is enforced
- [ ] Check CORS configuration
- [ ] Review Content Security Policy
- [ ] Test rate limiting (if implemented)
- [ ] Verify authentication flows
- [ ] Test RLS policies in production
- [ ] Scan for vulnerabilities (npm audit)
- [ ] Review Supabase security settings

### Monitoring
- [ ] Set up error tracking (Sentry recommended)
- [ ] Configure uptime monitoring (UptimeRobot, etc.)
- [ ] Set up database monitoring (Supabase dashboard)
- [ ] Monitor storage usage
- [ ] Set up alerting for critical errors
- [ ] Configure log aggregation

### Documentation
- [ ] Update README with production URL
- [ ] Document API endpoints for partners
- [ ] Create user guide (Nepali/English)
- [ ] Document admin procedures (future)
- [ ] Create troubleshooting guide

## Legal & Compliance

- [ ] Review Nepal's privacy laws compliance
- [ ] Prepare terms of service
- [ ] Prepare privacy policy
- [ ] Prepare data retention policy
- [ ] Review NPPA/CIAA integration requirements (future)
- [ ] Consult legal team on whistleblower protection

## Launch Preparation

### Content
- [ ] Prepare launch announcement (Nepali/English)
- [ ] Create FAQ page
- [ ] Write RTI rights guide
- [ ] Prepare anti-corruption resources
- [ ] Create tutorial videos (optional)

### Marketing
- [ ] Set up social media accounts
- [ ] Prepare press release
- [ ] Contact civic-tech organizations
- [ ] Reach out to media partners
- [ ] Plan launch event (optional)

### Support
- [ ] Set up support email/contact form
- [ ] Prepare response templates
- [ ] Train support team (if applicable)
- [ ] Create escalation procedures

## Post-Launch

### Week 1
- [ ] Monitor error rates closely
- [ ] Respond to user feedback
- [ ] Fix critical bugs immediately
- [ ] Monitor database performance
- [ ] Check storage usage trends
- [ ] Review complaint quality

### Month 1
- [ ] Analyze usage statistics
- [ ] Gather user feedback
- [ ] Plan feature improvements
- [ ] Review complaint resolution rates
- [ ] Optimize slow queries
- [ ] Update documentation based on FAQs

### Ongoing
- [ ] Weekly database backups verification
- [ ] Monthly security audits
- [ ] Quarterly performance reviews
- [ ] Regular dependency updates
- [ ] Community engagement
- [ ] Partnership development

## Rollback Plan

### Emergency Procedures
- [ ] Document rollback steps
- [ ] Test rollback procedure
- [ ] Maintain previous version deployment
- [ ] Document database migration rollback
- [ ] Set up emergency contact list

### Database Backup
```bash
# Backup before major changes
pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql

# Restore if needed
psql -h db.your-project.supabase.co -U postgres -d postgres < backup.sql
```

## Success Metrics

### Technical KPIs
- Uptime: Target 99.9%
- API response time: < 500ms (p95)
- Error rate: < 0.1%
- Page load time: < 3s

### User KPIs
- Complaints submitted: Track weekly
- Tracking page visits: Track daily
- Evidence uploads: Track weekly
- User satisfaction: Survey quarterly

---

**Last Updated:** December 18, 2025  
**Version:** 1.0.0  
**Status:** MVP Ready
