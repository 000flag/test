"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { SmileIcon, MehIcon, FrownIcon, AlertCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"

// 서류 통과된 기업 목록 (실제로는 API에서 가져올 데이터)
const passedCompanies = [
  {
    id: 1,
    name: "테크 솔루션즈",
    position: "프론트엔드 개발자",
    category: "개발",
    date: "2025-02-15",
    hasReview: false,
    status: "pending",
    logo: null, // 로고가 없는 경우 null
  },
  {
    id: 2,
    name: "디지털 이노베이션",
    position: "백엔드 개발자",
    category: "개발",
    date: "2025-02-10",
    hasReview: true,
    status: "pass",
    logo: null,
  },
  {
    id: 3,
    name: "클라우드 시스템즈",
    position: "풀스택 개발자",
    category: "개발",
    date: "2025-01-25",
    hasReview: false,
    status: "pending",
    logo: null,
  },
  {
    id: 4,
    name: "AI 테크놀로지",
    position: "UI/UX 디자이너",
    category: "디자인",
    date: "2025-01-20",
    hasReview: false,
    status: "fail",
    logo: null,
  },
  {
    id: 5,
    name: "소프트웨어 랩스",
    position: "시스템 엔지니어",
    category: "IT인프라",
    date: "2025-01-15",
    hasReview: true,
    status: "pending",
    logo: null,
  },
]

// 직무 카테고리 및 세부 직무
const jobCategories = [
  {
    category: "개발",
    jobs: ["프론트엔드 개발자", "백엔드 개발자", "풀스택 개발자", "모바일 앱 개발자", "게임 개발자", "DevOps 엔지니어"],
  },
  {
    category: "디자인",
    jobs: ["UI/UX 디자이너", "웹 디자이너", "그래픽 디자이너", "제품 디자이너", "브랜드 디자이너"],
  },
  {
    category: "마케팅",
    jobs: ["디지털 마케터", "콘텐츠 마케터", "브랜드 마케터", "그로스 마케터", "퍼포먼스 마케터"],
  },
  {
    category: "기획",
    jobs: ["서비스 기획자", "제품 기획자", "전략 기획자", "사업 기획자"],
  },
  {
    category: "IT인프라",
    jobs: ["시스템 엔지니어", "네트워크 엔지니어", "보안 엔지니어", "클라우드 엔지니어"],
  },
  {
    category: "데이터",
    jobs: ["데이터 분석가", "데이터 엔지니어", "데이터 사이언티스트", "머신러닝 엔지니어"],
  },
]

// 기본 면접 질문 목록
const defaultQuestions = [
  "자기소개를 해주세요.",
  "지원 동기가 무엇인가요?",
  "이전 프로젝트에서의 경험을 설명해주세요.",
  "본인의 강점과 약점은 무엇인가요?",
  "우리 회사에 지원한 이유는 무엇인가요?",
  "5년 후 자신의 모습을 어떻게 그리고 있나요?",
  "팀 내 갈등 상황을 어떻게 해결했나요?",
  "실패했던 경험과 그로부터 배운 점은 무엇인가요?",
]

export default function WriteInterviewReview({ params }: { params: { id: string } }) {
  const router = useRouter()
  const companyId = Number.parseInt(params.id)
  const company = passedCompanies.find((c) => c.id === companyId)

  const [selectedCategory, setSelectedCategory] = useState(company?.category || "")
  const [formData, setFormData] = useState({
    companyName: company?.name || "",
    position: company?.position || "",
    jobCategory: company?.category || "",
    experience: "",
    interviewYear: new Date().getFullYear().toString(),
    interviewMonth: (new Date().getMonth() + 1).toString().padStart(2, "0"),
    overallRating: "positive",
    difficulty: "normal",
    interviewTypes: [] as string[],
    otherType: "",
    interviewFormat: "1:1",
    review: "",
    questions: [] as string[],
    customQuestions: [""],
    tips: "",
    result: company?.status || "pending",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === "jobCategory") {
      setSelectedCategory(value)
      setFormData((prev) => ({ ...prev, [name]: value, position: "" }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        interviewTypes: [...prev.interviewTypes, value],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        interviewTypes: prev.interviewTypes.filter((type) => type !== value),
      }))
    }
  }

  const handleDefaultQuestionChange = (value: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        questions: [...prev.questions, value],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        questions: prev.questions.filter((q) => q !== value),
      }))
    }
  }

  const handleCustomQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...formData.customQuestions]
    updatedQuestions[index] = value
    setFormData((prev) => ({ ...prev, customQuestions: updatedQuestions }))
  }

  const addCustomQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      customQuestions: [...prev.customQuestions, ""],
    }))
  }

  const removeCustomQuestion = (index: number) => {
    const updatedQuestions = [...formData.customQuestions]
    updatedQuestions.splice(index, 1)
    setFormData((prev) => ({ ...prev, customQuestions: updatedQuestions }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // 실제로는 API 호출로 데이터 저장
    router.push("/mypage/interview-reviews")
  }

  // 연도 옵션 생성 (현재 연도부터 5년 전까지)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i)

  // 선택된 카테고리에 해당하는 직무 목록
  const jobsForCategory = jobCategories.find((cat) => cat.category === selectedCategory)?.jobs || []

  // 필수 입력 필드 표시 컴포넌트
  const RequiredField = () => <span className="text-red-500 ml-1">*</span>

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">면접후기 작성</h1>
        <Button variant="outline" asChild>
          <Link href="/mypage/interview-reviews">목록으로</Link>
        </Button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">면접후기 작성 안내</p>
          <p className="text-sm text-amber-700">
            면접후기는 다른 구직자들에게 큰 도움이 됩니다. 최대한 상세하게 작성해 주시면 감사하겠습니다.
            <br />
            <span className="text-red-500">*</span> 표시는 필수 입력 항목입니다.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-8">
          <CardHeader className="border-b">
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>면접 기본 정보를 입력해주세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">
                  기업명
                  <RequiredField />
                </Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-muted-foreground">기업명은 자동으로 설정됩니다.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">
                  지원자 경력
                  <RequiredField />
                </Label>
                <Select
                  value={formData.experience}
                  onValueChange={(value) => handleSelectChange("experience", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="경력을 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="신입">신입</SelectItem>
                    <SelectItem value="1년 미만">1년 미만</SelectItem>
                    <SelectItem value="1-3년">1-3년</SelectItem>
                    <SelectItem value="3-5년">3-5년</SelectItem>
                    <SelectItem value="5-10년">5-10년</SelectItem>
                    <SelectItem value="10년 이상">10년 이상</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="jobCategory">
                  직무 카테고리
                  <RequiredField />
                </Label>
                <Select
                  value={formData.jobCategory}
                  onValueChange={(value) => handleSelectChange("jobCategory", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="직무 카테고리를 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobCategories.map((category) => (
                      <SelectItem key={category.category} value={category.category}>
                        {category.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">
                  지원 직무
                  <RequiredField />
                </Label>
                <Select
                  value={formData.position}
                  onValueChange={(value) => handleSelectChange("position", value)}
                  disabled={!formData.jobCategory}
                  required
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={formData.jobCategory ? "직무를 선택해주세요" : "카테고리를 먼저 선택해주세요"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {jobsForCategory.map((job) => (
                      <SelectItem key={job} value={job}>
                        {job}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                면접 일자
                <RequiredField />
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={formData.interviewYear}
                  onValueChange={(value) => handleSelectChange("interviewYear", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="연도 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}년
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={formData.interviewMonth}
                  onValueChange={(value) => handleSelectChange("interviewMonth", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="월 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <SelectItem key={month} value={month.toString().padStart(2, "0")}>
                        {month}월
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader className="border-b">
            <CardTitle>면접 정보</CardTitle>
            <CardDescription>면접에 대한 정보를 입력해주세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-3">
              <Label>
                전반적인 평가
                <RequiredField />
              </Label>
              <RadioGroup
                value={formData.overallRating}
                onValueChange={(value) => handleSelectChange("overallRating", value)}
                className="flex space-x-8"
                required
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                    <RadioGroupItem value="positive" id="positive" className="sr-only" />
                    <Label htmlFor="positive" className="cursor-pointer">
                      <SmileIcon className="h-8 w-8 text-green-500" />
                    </Label>
                  </div>
                  <span className="text-sm font-medium">긍정적</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100">
                    <RadioGroupItem value="neutral" id="neutral" className="sr-only" />
                    <Label htmlFor="neutral" className="cursor-pointer">
                      <MehIcon className="h-8 w-8 text-amber-500" />
                    </Label>
                  </div>
                  <span className="text-sm font-medium">보통</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
                    <RadioGroupItem value="negative" id="negative" className="sr-only" />
                    <Label htmlFor="negative" className="cursor-pointer">
                      <FrownIcon className="h-8 w-8 text-red-500" />
                    </Label>
                  </div>
                  <span className="text-sm font-medium">부정적</span>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>
                난이도
                <RequiredField />
              </Label>
              <RadioGroup
                value={formData.difficulty}
                onValueChange={(value) => handleSelectChange("difficulty", value)}
                className="flex space-x-4"
                required
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="easy" id="easy" />
                  <Label htmlFor="easy">쉬움</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="normal" />
                  <Label htmlFor="normal">보통</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hard" id="hard" />
                  <Label htmlFor="hard">어려움</Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>
                면접 및 전형유형 (복수 선택 가능)
                <RequiredField />
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  { id: "job", label: "직무/인성면접" },
                  { id: "pt", label: "PT면접" },
                  { id: "discussion", label: "토론면접" },
                  { id: "task", label: "실무 과제 및 시험" },
                  { id: "aptitude", label: "인적성 검사" },
                ].map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.id}
                      checked={formData.interviewTypes.includes(type.id)}
                      onCheckedChange={(checked) => handleCheckboxChange(type.id, checked as boolean)}
                    />
                    <Label htmlFor={type.id}>{type.label}</Label>
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="other"
                  checked={formData.interviewTypes.includes("other")}
                  onCheckedChange={(checked) => handleCheckboxChange("other", checked as boolean)}
                />
                <Label htmlFor="other">기타</Label>
                {formData.interviewTypes.includes("other") && (
                  <Input
                    className="ml-2 w-64"
                    placeholder="기타 유형을 입력하세요"
                    name="otherType"
                    value={formData.otherType}
                    onChange={handleInputChange}
                  />
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>
                면접 인원
                <RequiredField />
              </Label>
              <RadioGroup
                value={formData.interviewFormat}
                onValueChange={(value) => handleSelectChange("interviewFormat", value)}
                className="space-y-2"
                required
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1:1" id="oneToOne" />
                  <Label htmlFor="oneToOne">1:1 면접</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1:n" id="oneToMany" />
                  <Label htmlFor="oneToMany">지원자 1명, 면접관 다수</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="group" id="group" />
                  <Label htmlFor="group">그룹면접</Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label htmlFor="review">
                면접 후기
                <RequiredField />
              </Label>
              <Textarea
                id="review"
                name="review"
                placeholder="면접 과정과 느낀 점을 자유롭게 작성해주세요. (최소 20자 이상)"
                className="min-h-[150px]"
                value={formData.review}
                onChange={handleInputChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                면접 진행 방식, 분위기, 질문 유형 등 상세하게 작성해주시면 다른 구직자에게 큰 도움이 됩니다.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader className="border-b">
            <CardTitle>합격 정보 입력</CardTitle>
            <CardDescription>면접 질문과 팁, 합격 여부를 입력해주세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-3">
              <Label>면접 질문 (기본 질문 중 선택)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {defaultQuestions.map((question, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`q-${index}`}
                      checked={formData.questions.includes(question)}
                      onCheckedChange={(checked) => handleDefaultQuestionChange(question, checked as boolean)}
                    />
                    <Label htmlFor={`q-${index}`} className="text-sm">
                      {question}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>면접 질문 (직접 입력)</Label>
              <div className="space-y-2">
                {formData.customQuestions.map((question, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder={`질문 ${index + 1}`}
                      value={question}
                      onChange={(e) => handleCustomQuestionChange(index, e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex space-x-1">
                      {formData.customQuestions.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeCustomQuestion(index)}
                          className="h-8 w-8"
                        >
                          -
                        </Button>
                      )}
                      {index === formData.customQuestions.length - 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={addCustomQuestion}
                          className="h-8 w-8"
                        >
                          +
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">면접에서 받은 질문을 최대한 자세히 기록해주세요.</p>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label htmlFor="tips">면접 팁</Label>
              <Textarea
                id="tips"
                name="tips"
                placeholder="다른 지원자들에게 도움이 될 만한 팁을 공유해주세요."
                className="min-h-[100px]"
                value={formData.tips}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">면접 준비 방법, 주의사항, 합격 노하우 등을 공유해주세요.</p>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>
                합격 여부
                <RequiredField />
              </Label>
              <RadioGroup
                value={formData.result}
                onValueChange={(value) => handleSelectChange("result", value)}
                className="flex space-x-4"
                required
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pass" id="pass" />
                  <Label htmlFor="pass">합격</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pending" id="waiting" />
                  <Label htmlFor="waiting">대기중</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fail" id="fail" />
                  <Label htmlFor="fail">불합격</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2 border-t pt-6">
            <Button variant="outline" type="button" asChild>
              <Link href="/mypage/interview-reviews">취소</Link>
            </Button>
            <Button type="submit">등록하기</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

