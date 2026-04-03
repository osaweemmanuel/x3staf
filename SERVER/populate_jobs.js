const { Job } = require('./models');
const { sequelize } = require('./config/database');

async function populateJobs() {
  try {
    await sequelize.authenticate();
    console.log('Database connected for elite job populating...');
    
    // Clear existing jobs safely
    await Job.destroy({ where: {} });
    console.log('Registry cleared for fresh synchronisation.');

    // External Marketplace Jobs (Detailed & Professional)
    const externalJobs = [
      {
        title: "Senior Logistics Coordinator",
        address: "Metrotown, Burnaby BC",
        compensation: "$32.50/hr",
        department: "Logistics",
        employmentType: "Full-time",
        province: "BC",
        description: "We are seeking a high-caliber Logistics Coordinator to architect and oversee comprehensive regional fleet operations. This role is pivotal in maintaining the X3 Standard across our Tier-1 supply chain partners, ensuring zero-latency transitions and optimized throughput for large-scale distribution networks.",
        requirements: "• Minimum 5 years of experience in supply chain management.\n• Proficient in TMS (Transportation Management Systems) and advanced data analytics.\n• Demonstrated success in handling multi-million dollar logistics budgets.\n• Exceptional crisis-management and strategic planning capabilities.",
        closingDate: "2026-06-30",
        minimumExperience: 5,
        jobCategory: "External"
      },
      {
        title: "Warehouse Safety Supervisor",
        address: "Delta, BC",
        compensation: "$28.00/hr",
        department: "Safety",
        employmentType: "Full-time",
        province: "BC",
        description: "Lead the vanguard of operational safety. The Safety Supervisor will be responsible for the rigorous enforcement of province-wide health and safety protocols across our automated warehouse facilities. You will perform deep-dive audits, lead safety workshops, and ensure our incident-free record remains the industry benchmark.",
        requirements: "• Valid CRSP (Canadian Registered Safety Professional) designation.\n• Thorough knowledge of WorkSafeBC regulations and OHS regulations.\n• Proven experience in hazardous material handling and emergency response leadership.\n• Strong background in industrial engineering or related safety disciplines.",
        closingDate: "2026-07-15",
        minimumExperience: 3,
        jobCategory: "External"
      },
      {
        title: "General Labour (Project Delta)",
        address: "Surrey Central, BC",
        compensation: "$21.00/hr",
        department: "General Labour",
        employmentType: "Contract",
        province: "BC",
        description: "Join the largest infrastructure project in the region. Project Delta requires elite general personnel capable of maintaining high efficiency in demanding environments. This involves precision material handling, supporting specialized trades, and adhering to strict project timelines to ensure mission-critical completion dates are met.",
        requirements: "• Physical ability to lift up to 50lbs and work in variable weather conditions.\n• Valid CSTS-2020 (Construction Safety Training System) certificate.\n• Proficiency with basic industrial tools and material-moving machinery.\n• Resilience and a strong commitment to worksite punctuality.",
        closingDate: "2026-05-20",
        minimumExperience: 1,
        jobCategory: "External"
      }
    ];

    // Internal Careers (X3 Staffing Staff Roles)
    const internalJobs = [
      {
        title: "Internal Recruitment Specialist",
        address: "Langley Headquarters, BC",
        compensation: "$65k - $75k Annual",
        department: "Human Resources",
        employmentType: "Full-time",
        province: "BC",
        description: "As we scale our operations, X3 Staffing is looking for an Internal Recruitment Specialist to identify and cultivate the next wave of elite personnel. You will drive our proprietary vetting protocol, manage high-level talent pipelines, and shape the culture of the most reliable staffing agency in Western Canada.",
        requirements: "• CHRP (Certified Human Resources Professional) or equivalent.\n• 3+ years in high-volume technical or industrial recruitment.\n• Experience with ATS systems and proactive headhunting strategies.\n• Deep understanding of the specific labor market dynamics in the Greater Vancouver Area.",
        closingDate: "2026-08-01",
        minimumExperience: 3,
        jobCategory: "Internal"
      },
      {
        title: "Operations Dispatcher",
        address: "Langley, BC (Hybrid)",
        compensation: "$24.50/hr",
        department: "Operations",
        employmentType: "Full-time",
        province: "BC",
        description: "Become the heartbeat of X3 logistics. The Operations Dispatcher manages our proprietary 'Personnel Sync' protocol, coordinating real-time deployments across hundreds of client sites. You are the primary interface between our personnel and our clients, ensuring that the right person is at the right site at the precise time required.",
        requirements: "• Prior experience in emergency dispatch or logistics coordination preferred.\n• Bilingual fluency (English/French) is a significant asset.\n• Mastery of communication protocols and rapid problem-solving.\n• Ability to handle high-stress environments with mathematical precision.",
        closingDate: "2026-09-10",
        minimumExperience: 2,
        jobCategory: "Internal"
      }
    ];

    console.log('Inserting Detailed External Jobs...');
    await Job.bulkCreate(externalJobs);
    
    console.log('Inserting Detailed Internal Career Roles...');
    await Job.bulkCreate(internalJobs);

    console.log('✅ Elite Registry fully synchronized with requirements!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Elite Population failed:', error);
    process.exit(1);
  }
}

populateJobs();
