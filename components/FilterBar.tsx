import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTopicStore } from '@/store/topicStore';
import { learningPathConfigs, difficultyConfigs } from '@/constants/learningPaths';
import colors from '@/constants/colors';
import { MitreTactic } from '@/types/TranslationCard';

const tactics: MitreTactic[] = [
  'Reconnaissance', 'Resource Development', 'Initial Access', 'Execution',
  'Persistence', 'Privilege Escalation', 'Defense Evasion', 'Credential Access',
  'Discovery', 'Lateral Movement', 'Collection', 'Command and Control',
  'Exfiltration', 'Impact',
];

export default function FilterBar() {
  const { filters, setFilter, clearFilters } = useTopicStore();
  const hasFilters = filters.difficulty || filters.learningPath || filters.tactic;

  return (
    <View style={styles.container}>
      {/* Learning Path */}
      <Text style={styles.label}>Learning Path</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
        {learningPathConfigs.map(p => {
          const active = filters.learningPath === p.name;
          return (
            <TouchableOpacity
              key={p.id}
              style={[styles.chip, active && { backgroundColor: p.color }]}
              onPress={() => setFilter('learningPath', active ? null : p.name)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{p.name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Difficulty */}
      <Text style={styles.label}>Difficulty</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
        {difficultyConfigs.map(d => {
          const active = filters.difficulty === d.level;
          return (
            <TouchableOpacity
              key={d.level}
              style={[styles.chip, active && { backgroundColor: d.color }]}
              onPress={() => setFilter('difficulty', active ? null : d.level)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{d.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Tactic */}
      <Text style={styles.label}>Tactic</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
        {tactics.map(t => {
          const active = filters.tactic === t;
          return (
            <TouchableOpacity
              key={t}
              style={[styles.chip, active && { backgroundColor: colors.primary }]}
              onPress={() => setFilter('tactic', active ? null : t)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{t}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {hasFilters && (
        <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
          <Text style={styles.clearText}>Clear Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingBottom: 8 },
  label: { fontSize: 12, fontWeight: '700', color: colors.textSecondary, marginTop: 10, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { flexDirection: 'row', marginBottom: 4 },
  chip: {
    backgroundColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  chipText: { fontSize: 12, fontWeight: '600', color: colors.text },
  chipTextActive: { color: '#fff' },
  clearButton: { alignSelf: 'center', marginTop: 8, paddingVertical: 6, paddingHorizontal: 14 },
  clearText: { fontSize: 12, fontWeight: '600', color: colors.primary },
});
