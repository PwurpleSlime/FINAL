//
//  ContentView.swift
//  Final-Front-End-IOS
//
//  Created by Student on 5/13/25.
//
struct MeetingPlace: Decodable {
    let host: String
    let address: String
    let timeStart: String
    let timeEnd: String?
    let dateStart: String
}

import SwiftUI
func getList()async throws->[MeetingPlace]{
    enum WebError: Error, LocalizedError{
        case wrongResponse
        case wrongStatus
    }
    
    let (data, response) = try await URLSession.shared.data(from: URL(string:"http://10.200.136.135:3005/getMeetingPlaces")!)

    
    guard let response = response as? HTTPURLResponse else {
        throw WebError.wrongResponse
    }
    
    guard response.statusCode == 200 else {
        throw WebError.wrongStatus
    }
    
    let jsonDecoder = JSONDecoder()
    let results = try jsonDecoder.decode([MeetingPlace].self, from: data)
    
    return results

}

struct ContentView: View {
    @State private var meetingPlaces: [MeetingPlace] = []

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                ForEach(meetingPlaces.indices, id: \.self) { index in
                    MeetinPlaceCard(place: meetingPlaces[index])
                }
            }
            .padding()
            .onAppear{
                print("Attempt")
                Task{
                    print("Try")
                    meetingPlaces = (try await getList())
                }
            }
        }
    }
}

#Preview {
    ContentView()
}
