import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { DataSumatifNilai } from '@/pages/api/pdf/route';

interface NilaiKelasProps {
  title: string;
  dataNilai: DataSumatifNilai[];
}

export const NilaiKelas: React.FC<NilaiKelasProps> = ({ title, dataNilai }: NilaiKelasProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>Dibuat pada {new Date().toLocaleDateString()}</Text>
      </View>

      {/* Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.cellNo]}>No</Text>
          <Text style={[styles.tableCell, styles.cellNim]}>NIM</Text>
          <Text style={[styles.tableCell, styles.cellNama]}>Nama Mahasiswa</Text>
          {dataNilai[0]?.mahasiswa[0]?.nilai.map((item, index) => (
            <Text key={index} style={[styles.tableCell, styles.cellNilai]}>
              {item.nama}
            </Text>
          ))}
        </View>

        {/* Table Body */}
        {dataNilai[0]?.mahasiswa.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.cellNo]}>{index + 1}</Text>
            <Text style={[styles.tableCell, styles.cellNim]}>{item.nim}</Text>
            <Text style={[styles.tableCell, styles.cellNama]}>{item.nama}</Text>
            {item.nilai.map((n, i) => (
              <Text key={i} style={[styles.tableCell, styles.cellNilai]}>
                {n.nilai}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  date: {
    fontSize: 10,
    color: '#666666',
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    minHeight: 35,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#F5F5F5',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#CCCCCC',
  },
  tableCell: {
    fontSize: 9,
    padding: 8,
    textAlign: 'center',
  },
  cellNo: {
    width: '8%',
  },
  cellNim: {
    width: '20%',
    backgroundColor: '#E8F4F8',
  },
  cellNama: {
    width: '32%',
    textAlign: 'left',
  },
  cellNilai: {
    width: '13.33%',
  },
});