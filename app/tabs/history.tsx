import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useTopicStore } from '@/store/topicStore';
import techniques from '@/constants/techniques';
import colors from '@/constants/colors';
import { difficultyConfigs } from '@/constants/learningPaths';

type Tab = 'history' | 'favorites';

export default function HistoryScreen() {
  const { cardHistory, favorites } = useTopicStore();
  const [tab, setTab] = useState<Tab>('history');

  const favCards = techniques.filter(t => favorites.includes(t.techniqueId));
  const items = tab === 'history' ? cardHistory : favCards;

  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, tab === 'history' && styles.tabActive]}
          onPress={() => setTab('history')}
        >
          <Text style={[styles.tabText, tab === 'history' && styles.tabTextActive]}>
            History ({cardHistory.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'favorites' && styles.tabActive]}
          onPress={() => setTab('favorites')}
        >
          <Text style={[styles.tabText, tab === 'favorites' && styles.tabTextActive]}>
            Favorites ({favorites.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {tab === 'history'
                ? 'No concepts explored yet. Tap the button on the home screen to start learning!'
                : 'No favorites yet. Star a Translation Card to save it here.'}
            </Text>
          </View>
        ) : (
          items.map((card, index) => {
            const diff = difficultyConfigs.find(d => d.level === card.difficulty);
            return (
              <View key={`${card.techniqueId}-${index}`} style={styles.item}>
                <View style={styles.itemHeader}>
                  <View style={styles.idBadge}>
                    <Text style={styles.idText}>{card.techniqueId}</Text>
                  </View>
                  <Text style={styles.itemName}>{card.techniqueName}</Text>
                  <View style={[styles.diffDot, { backgroundColor: diff?.color || '#999' }]} />
                </View>
                <Text style={styles.itemTactic}>{card.tactic}</Text>
                <Text style={styles.itemDesc} numberOfLines={2}>{card.plainExplanation}</Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  tabTextActive: { color: colors.primary },
  list: { flex: 1 },
  listContent: { padding: 16 },
  emptyState: { paddingTop: 60, alignItems: 'center', paddingHorizontal: 40 },
  emptyText: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  item: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  idBadge: {
    backgroundColor: '#222',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  idText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  itemName: { fontSize: 15, fontWeight: '700', color: colors.text, flex: 1 },
  diffDot: { width: 10, height: 10, borderRadius: 5, marginLeft: 8 },
  itemTactic: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  itemDesc: { fontSize: 13, color: colors.text, lineHeight: 18 },
});
