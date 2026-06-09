import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { GovernmentCVData } from '@/types/governmentCV.types';

const styles = StyleSheet.create({
  page: {
    padding: '25.4mm', // Exactly 1 inch
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.4,
  },
  header: {
    textAlign: 'center',
    marginBottom: 18,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    marginBottom: 4,
  },
  contact: {
    fontSize: 10,
    color: '#333333',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    marginTop: 8,
    marginBottom: 8,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    color: '#000000',
    marginBottom: 1,
  },
  summary: {
    fontSize: 10,
    textAlign: 'justify',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  },
  itemBlock: {
    marginBottom: 12,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 18,
  },
  bulletPoint: {
    width: 10,
  },
  bulletText: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  gridLabel: {
    width: 140,
  },
  gridValue: {
    flex: 1,
  }
});

interface PDFProps {
  data: GovernmentCVData;
}

export const GovernmentCVPdfExporter: React.FC<PDFProps> = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo.fullName || 'First Name Last Name'}</Text>
          <View style={styles.divider} />
          <Text style={styles.contact}>
            {data.personalInfo.address || 'Address'} | {data.personalInfo.email || 'Email'}
          </Text>
          <Text style={styles.contact}>
            {data.personalInfo.linkedin || 'LinkedIn'} | Contact: {data.personalInfo.phone || 'Phone'}
          </Text>
          <View style={styles.divider} />
        </View>

        {/* Summary */}
        {data.summary && (
          <Text style={styles.summary}>{data.summary}</Text>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.divider} />
            {data.skills.map((skill) => (
              <View key={skill.id} style={styles.bulletItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.bulletText}>
                  <Text style={styles.bold}>{skill.category}: </Text>{skill.skills}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Work Experience */}
        {data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            <View style={styles.divider} />
            {data.experience.map((exp) => (
              <View key={exp.id} style={styles.itemBlock} wrap={false}>
                <View style={styles.row}>
                  <Text style={styles.bold}>{exp.jobTitle}</Text>
                  <Text>{exp.location}{exp.location ? '. ' : ''}{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</Text>
                </View>
                {exp.company && <Text style={{ marginBottom: 4 }}>{exp.company}</Text>}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <Text style={{ textAlign: 'justify', marginBottom: 4 }}>{exp.responsibilities.join(' ')}</Text>
                )}
                {exp.achievements.map((ach, idx) => (
                  <View key={idx} style={styles.bulletItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletText}>{ach}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Education and Training</Text>
            <View style={styles.divider} />
            {data.education.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 8 }}>
                <View style={styles.row}>
                  <Text style={styles.bold}>{edu.degree}</Text>
                  <Text>{edu.startDate} - {edu.endDate || 'Present'}</Text>
                </View>
                <View style={styles.row}>
                  <Text>{edu.institution}</Text>
                  {edu.gpa && <Text>{edu.gpa}</Text>}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Language */}
        {data.languages.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Language Proficiency</Text>
            <View style={styles.divider} />
            {data.languages.map((lang) => (
              <View key={lang.id} style={styles.bulletItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.bulletText}>
                  <Text style={styles.bold}>{lang.name}: </Text>{lang.fluency}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Extracurricular */}
        {data.extracurricular.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Extracurricular Activities:</Text>
            <View style={styles.divider} />
            {data.extracurricular.map((item) => (
              <View key={item.id} style={styles.bulletItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.bulletText}>
                  <Text style={styles.bold}>{item.role}, </Text>{item.organization}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Personal Info */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.divider} />
          {data.personalInfo.fatherName && (
            <View style={styles.grid}><Text style={styles.gridLabel}>{"Father's Name"}</Text><Text style={styles.gridValue}>: {data.personalInfo.fatherName}</Text></View>
          )}
          {data.personalInfo.motherName && (
            <View style={styles.grid}><Text style={styles.gridLabel}>{"Mother's Name"}</Text><Text style={styles.gridValue}>: {data.personalInfo.motherName}</Text></View>
          )}
          {data.personalInfo.dateOfBirth && (
            <View style={styles.grid}><Text style={styles.gridLabel}>Date of Birth</Text><Text style={styles.gridValue}>: {data.personalInfo.dateOfBirth}</Text></View>
          )}
          {data.personalInfo.gender && (
            <View style={styles.grid}><Text style={styles.gridLabel}>Gender</Text><Text style={styles.gridValue}>: {data.personalInfo.gender}</Text></View>
          )}
          {data.personalInfo.maritalStatus && (
            <View style={styles.grid}><Text style={styles.gridLabel}>Marital Status</Text><Text style={styles.gridValue}>: {data.personalInfo.maritalStatus}</Text></View>
          )}
          {data.personalInfo.nationality && (
            <View style={styles.grid}><Text style={styles.gridLabel}>Nationality</Text><Text style={styles.gridValue}>: {data.personalInfo.nationality}</Text></View>
          )}
          {data.personalInfo.religion && (
            <View style={styles.grid}><Text style={styles.gridLabel}>Religion</Text><Text style={styles.gridValue}>: {data.personalInfo.religion}</Text></View>
          )}
          {data.personalInfo.permanentAddress && (
            <View style={styles.grid}><Text style={styles.gridLabel}>Permanent Address</Text><Text style={styles.gridValue}>: {data.personalInfo.permanentAddress}</Text></View>
          )}
        </View>

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <View style={styles.divider} />
            <View style={styles.bulletItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.bold}>Certifications: </Text>
                {data.certifications.map(c => c.name).join(', ')}
              </Text>
            </View>
          </View>
        )}

      </Page>
    </Document>
  );
};
