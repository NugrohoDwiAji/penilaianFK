import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, User, BookOpen } from 'lucide-react';
import axios from 'axios';


// type
type SumatifNode = {
  id: string;
  nama: string;
  bobot: number;
  nilai: number;
  children: SumatifNode[];
};
type MataKuliah = {
  id: string;
  nama: string;
  nilai: number;
  sumatif: SumatifNode[];
};
type Mahasiswa = {
  id: string;
  nama: string;
  nim: string;
  matakuliah: MataKuliah[];
};




const Dashboard = () => {
  const [expandedStudents, setExpandedStudents] = useState(new Set());
  const [expandedCourses, setExpandedCourses] = useState(new Set());
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [students, setStudents] = useState<Mahasiswa[]>([]);


  const handleGetMhs = async()=>{
    try {
      await axios.get("/api/penilaian").then((res) => setStudents(res.data.datas));
    } catch (error) {
      console.log(error)
      
    }
  }
 

  const toggleStudent = (id:string) => {
    const newExpanded = new Set(expandedStudents);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedStudents(newExpanded);
  };

  const toggleCourse = (id:string) => {
    const newExpanded = new Set(expandedCourses);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCourses(newExpanded);
  };

  const toggleItem = (id:string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };


  const getNilaiColor = (nilai:number) => {
    if (nilai >= 75) return 'bg-green-100 text-green-800';
    if (nilai >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  useEffect(() => {
    handleGetMhs();
  }, [])
  

  const renderChildren = (children:SumatifNode[], level = 0) => {
    if (!children || children.length === 0) return null;

    return children.map((child) => {
      const isExpanded = expandedItems.has(child.id);
      const hasChildren = child.children && child.children.length > 0;
      const paddingLeft = (level + 3) * 20;

      return (
        <React.Fragment key={child.id}>
          <tr className="border-b border-gray-200 hover:bg-blue-50">
            <td className="px-4 py-3" style={{ paddingLeft: `${paddingLeft}px` }}>
              <div className="flex items-center gap-2">
                {hasChildren ? (
                  <button
                    onClick={() => toggleItem(child.id)}
                    className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                  >
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                ) : (
                  <span className="w-4 flex-shrink-0"></span>
                )}
                <span className="text-sm text-gray-700">{child.nama}</span>
              </div>
            </td>
            <td className="px-4 py-3 text-center text-sm text-gray-600">
              {child.bobot}%
            </td>
            <td className="px-4 py-3 text-center">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getNilaiColor(child.nilai)}`}>
                {child.nilai}
              </span>
            </td>
          </tr>
          {isExpanded && renderChildren(child.children, level + 1)}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Data Nilai Mahasiswa</h1>
            <p className="text-blue-100 text-sm mt-1">Sistem Informasi Akademik</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Nama / Mata Kuliah / Komponen
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-32">
                    Bobot
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-32">
                    Nilai
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const isStudentExpanded = expandedStudents.has(student.id);
                  const hasCourses = student.matakuliah && student.matakuliah.length > 0;

                  return (
                    <React.Fragment key={student.id}>
                      <tr className="border-b-2 border-gray-300 bg-gray-50 hover:bg-gray-100">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {hasCourses ? (
                              <button
                                onClick={() => toggleStudent(student.id)}
                                className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                              >
                                {isStudentExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                              </button>
                            ) : (
                              <span className="w-5 flex-shrink-0"></span>
                            )}
                            <User size={20} className="text-blue-600 flex-shrink-0" />
                            <div>
                              <div className="font-semibold text-gray-800">{student.nama}</div>
                              <div className="text-sm text-gray-500">{student.nim}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center text-gray-400">-</td>
                        <td className="px-4 py-4 text-center text-gray-400">-</td>
                      </tr>

                      {isStudentExpanded && student.matakuliah.map((course) => {
                        const isCourseExpanded = expandedCourses.has(course.id);
                        const hasSumatif = course.sumatif && course.sumatif.length > 0;

                        return (
                          <React.Fragment key={course.id}>
                            <tr className="border-b border-gray-200 bg-blue-50 hover:bg-blue-100">
                              <td className="px-4 py-3 pl-10">
                                <div className="flex items-center gap-2">
                                  {hasSumatif ? (
                                    <button
                                      onClick={() => toggleCourse(course.id)}
                                      className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                                    >
                                      {isCourseExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                    </button>
                                  ) : (
                                    <span className="w-4.5 flex-shrink-0"></span>
                                  )}
                                  <BookOpen size={18} className="text-blue-600 flex-shrink-0" />
                                  <span className="font-medium text-gray-800">{course.nama}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center text-gray-400">-</td>
                              <td className="px-4 py-3 text-center">
                                <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${
                                  course.nilai >= 75 ? 'bg-green-500 text-white' :
                                  course.nilai >= 60 ? 'bg-yellow-500 text-white' :
                                  course.nilai > 0 ? 'bg-red-500 text-white' :
                                  'bg-gray-300 text-gray-600'
                                }`}>
                                  {course.nilai > 0 ? course.nilai : 'N/A'}
                                </span>
                              </td>
                            </tr>

                            {isCourseExpanded && course.sumatif.map((sumatif) => {
                              const isSumatifExpanded = expandedItems.has(sumatif.id);
                              const hasChildren = sumatif.children && sumatif.children.length > 0;

                              return (
                                <React.Fragment key={sumatif.id}>
                                  <tr className="border-b border-gray-200 hover:bg-blue-50">
                                    <td className="px-4 py-3 pl-16">
                                      <div className="flex items-center gap-2">
                                        {hasChildren ? (
                                          <button
                                            onClick={() => toggleItem(sumatif.id)}
                                            className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                                          >
                                            {isSumatifExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                          </button>
                                        ) : (
                                          <span className="w-4 flex-shrink-0"></span>
                                        )}
                                        <span className="text-sm font-medium text-gray-700">{sumatif.nama}</span>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                                      {sumatif.bobot}%
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getNilaiColor(sumatif.nilai)}`}>
                                        {sumatif.nilai}
                                      </span>
                                    </td>
                                  </tr>
                                  {isSumatifExpanded && renderChildren(sumatif.children, 0)}
                                </React.Fragment>
                              );
                            })}
                          </React.Fragment>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center gap-6 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span className="text-gray-600">≥ 75 (Baik)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                <span className="text-gray-600">60-74 (Cukup)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                <span className="text-gray-600">&lt; 60 (Kurang)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// Server-side protection
