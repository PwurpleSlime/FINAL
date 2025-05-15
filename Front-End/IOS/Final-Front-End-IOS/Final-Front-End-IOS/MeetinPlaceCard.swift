//
//  MeetinPlaceCard.swift
//  Final-Front-End-IOS
//
//  Created by Student on 5/13/25.
//

import SwiftUI

struct MeetinPlaceCard: View {
    let place: MeetingPlace
    @State var isVerified: Bool = false
    @State var hasAttemptedVerification = false

    func getList()async throws->Bool{
        enum WebError: Error, LocalizedError{
            case wrongResponse
            case wrongStatus
        }
        
        guard let url = URL(string: "http://10.200.136.135:3005/verifyAdmin") else {
            throw URLError(.badURL)
        }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")

        // Prepare JSON body
        let body: [String: String] = ["checkName": place.host]
        request.httpBody = try JSONEncoder().encode(body)

        // Perform the request
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw WebError.wrongResponse
        }
        guard httpResponse.statusCode == 200 else {
            throw WebError.wrongStatus
        }
        // Decode response
        let jsonDecoder = JSONDecoder()
        let results = try jsonDecoder.decode(Bool.self, from: data)
        print(results)
        isVerified = results
        return results

    }
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 8) {
                Text(place.host)
                    .font(.headline)
                Text(place.address)
                    .font(.subheadline)
                Text("Starts: \(place.timeStart) on \(place.dateStart)")
                    .font(.footnote)
                if let end = place.timeEnd, !end.isEmpty {
                    Text("Ends: \(end)")
                        .font(.footnote)
                }
            }
            Spacer()
            if (hasAttemptedVerification){
                if (isVerified){
                    Color.green
                        .frame(width: 50, height: 50)
                        .cornerRadius(10)

                }else{
                    Color.red
                        .frame(width: 50, height: 50)
                        .cornerRadius(10)

                }
            }else{
                Button {
                    Task{
                        try await getList()
                    }
                    hasAttemptedVerification = true
                } label: {
                    Text("Verify Meeting")
                }

            }
        }
        .frame(width:350)
        .padding()
        .background(Color.blue.opacity(0.1))
        .cornerRadius(10)
    }
}

#Preview {
    MeetinPlaceCard(place: MeetingPlace(host: "John Skyrim", address: "310 S Main Street", timeStart: "3:10am", timeEnd: "3:30am", dateStart: "May 4th"))
}
