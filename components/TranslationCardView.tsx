import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { TranslationCard } from '@/types/TranslationCard';
import { useTopicStore } from '@/store/topicStore';
import { difficultyConfigs } from '@/constants/learningPaths';
import colors from '@/constants/colors';

interface Props {
  card: TranslationCard;
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <View style={sectionStyles.container}>
      <TouchableOpacity onPress={() => setOpen(!open)} style={sectionStyles.header}>
        <Text style={sectionStyles.title}>{title}</Text>
        <Text style={sectionStyles.chevron}>{open ? '\u25B2' : '\u25BC'}</Text>
      </TouchableOpacity>
      {open && <View style={sectionStyles.body}>{children}</View>}
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  container: { marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  title: { fontSize: 15, fontWeight: '700', color: colors.text, textTransform: 'uppercase', letterSpacing: 0.5 },
  chevron: { fontSize: 12, color: colors.textSecondary },
  body: { marginTop: 6 },
});

export default function TranslationCardView({ card }: Props) {
  const { favorites, toggleFavorite, showAdvanced, toggleAdvanced } = useTopicStore();
  const isFav = favorites.includes(card.techniqueId);
  const diffConfig = difficultyConfigs.find(d => d.level === card.difficulty);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.idBadge}>
          <Text style={styles.idText}>{card.techniqueId}</Text>
        </View>
        <View style={[styles.diffBadge, { backgroundColor: diffConfig?.color || '#999' }]}>
          <Text style={styles.diffText}>{card.difficulty}</Text>
        </View>
        <TouchableOpacity onPress={() => toggleFavorite(card.techniqueId)} style={styles.favButton}>
          <Text style={styles.favIcon}>{isFav ? '\u2605' : '\u2606'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.techniqueName}>{card.techniqueName}</Text>

      <View style={styles.tacticRow}>
        <Text style={styles.tacticLabel}>Tactic:</Text>
        <Text style={styles.tacticValue}>{card.tactic}</Text>
        <Text style={styles.tacticId}>({card.tacticId})</Text>
      </View>

      <View style={styles.pathRow}>
        {card.learningPaths.map(p => (
          <View key={p} style={styles.pathBadge}>
            <Text style={styles.pathText}>{p}</Text>
          </View>
        ))}
      </View>

      {/* Plain Explanation */}
      <Section title="Plain Explanation">
        <Text style={styles.bodyText}>{card.plainExplanation}</Text>
      </Section>

      {/* Corporate Risk Translation */}
      <Section title="Corporate Risk Translation">
        <View style={styles.riskBadge}>
          <Text style={styles.riskBadgeText}>{card.riskCategory}</Text>
        </View>
        <Text style={styles.bodyText}>{card.riskDescription}</Text>
      </Section>

      {/* Boardroom Pitch */}
      <Section title="Boardroom Pitch">
        <View style={styles.pitchBox}>
          <Text style={styles.pitchText}>{card.boardroomPitch}</Text>
        </View>
      </Section>

      {/* Industry Impact */}
      <Section title="Industry Impact" defaultOpen={false}>
        {card.industryImpacts.map((impact, i) => (
          <View key={i} style={styles.impactItem}>
            <Text style={styles.impactIndustry}>{impact.industry}</Text>
            <Text style={styles.bodyText}>{impact.description}</Text>
          </View>
        ))}
      </Section>

      {/* Advanced Toggle */}
      <TouchableOpacity onPress={toggleAdvanced} style={styles.advancedToggle}>
        <Text style={styles.advancedToggleText}>
          {showAdvanced ? 'Hide Advanced Details' : 'Show Detection & Mitigation'}
        </Text>
      </TouchableOpacity>

      {showAdvanced && (
        <>
          <Section title="Detection Hints">
            {card.detectionHints.map((hint, i) => (
              <View key={i} style={styles.bulletItem}>
                <Text style={styles.bullet}>{'\u2022'}</Text>
                <Text style={styles.bodyText}>{hint}</Text>
              </View>
            ))}
          </Section>

          <Section title="Mitigations">
            {card.mitigations.map((m, i) => (
              <View key={i} style={styles.bulletItem}>
                <Text style={styles.bullet}>{'\u2022'}</Text>
                <Text style={styles.bodyText}>{m}</Text>
              </View>
            ))}
          </Section>
        </>
      )}

      {/* Micro-Assessment */}
      <Section title="Reflect" defaultOpen={false}>
        <Text style={styles.reflectionLabel}>Reflection Question</Text>
        <Text style={styles.bodyText}>{card.reflectionQuestion}</Text>
        <Text style={[styles.reflectionLabel, { marginTop: 12 }]}>Spot the Risk</Text>
        <Text style={styles.bodyText}>{card.spotTheRisk}</Text>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  idBadge: {
    backgroundColor: '#222',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 8,
  },
  idText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  diffBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 8,
  },
  diffText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  favButton: { marginLeft: 'auto', padding: 4 },
  favIcon: { fontSize: 22, color: '#FF9800' },
  techniqueName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
  },
  tacticRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tacticLabel: { fontSize: 13, color: colors.textSecondary, marginRight: 4 },
  tacticValue: { fontSize: 13, fontWeight: '600', color: colors.text, marginRight: 4 },
  tacticId: { fontSize: 12, color: colors.textSecondary },
  pathRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 14, gap: 6 },
  pathBadge: {
    backgroundColor: '#E8EAF6',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pathText: { fontSize: 11, fontWeight: '600', color: '#3949AB' },
  bodyText: { fontSize: 15, color: colors.text, lineHeight: 22, flex: 1 },
  riskBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  riskBadgeText: { fontSize: 12, fontWeight: '700', color: '#C62828' },
  pitchBox: {
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9800',
  },
  pitchText: { fontSize: 15, color: colors.text, lineHeight: 22, fontStyle: 'italic' },
  impactItem: { marginBottom: 10 },
  impactIndustry: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 2 },
  advancedToggle: {
    alignSelf: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 8,
  },
  advancedToggleText: { fontSize: 13, fontWeight: '600', color: '#1565C0' },
  bulletItem: { flexDirection: 'row', marginBottom: 4, paddingRight: 8 },
  bullet: { fontSize: 15, color: colors.text, marginRight: 8, lineHeight: 22 },
  reflectionLabel: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, marginBottom: 4 },
});
